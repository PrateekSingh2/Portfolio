---
title: "Building SchemaAI: How I Engineered a Zero-Trust Natural Language to SQL & GraphQL Middleware"
slug: "building-schema-ai-natural-language-sql-graphql-engine"
publishedAt: "16-Nov-2026"
author: "Prateek Singh"
authorAvatar: "/images/profile.png"
readingTime: "11 min"
tags:
  ["AI Engineering", "LangGraph", "Text-to-SQL", "System Design", "Case Study"]
excerpt: "The engineering story behind SchemaAI: how I tackled schema bloat, blocked destructive mutations with deterministic AST guardrails, and built self-correcting query pipelines with LangGraph and React Flow."
---

## 1. The Spark: Why the "20-Line Text-to-SQL Demo" Is a Trap

Like many engineers experimenting with LLMs, my initial impression of natural-language-to-SQL was pure excitement. Feeding an AI a user prompt alongside a couple of `CREATE TABLE` statements and watching it spit out functional SQL feels like the future of developer tooling.

My first prototype took less than an afternoon to build. It was a straightforward FastAPI endpoint that concatenated schema DDL into an OpenAI prompt and passed the output straight to a database connector. Against a small twenty-row SQLite database, it worked almost every single time.

Then, I connected that prototype to a realistic multi-table development database, and the illusion vanished.

Within the first hour of testing, three catastrophic bottlenecks surfaced:

- **Token Bloat and Context Exhaustion:** Feeding forty table DDLs into every query prompt consumed over 80,000 input tokens per turn. API costs skyrocketed, and response latency climbed past 6 seconds.
- **Silent Column and Join Hallucinations:** When schemas grew wider than ten tables, the model started guessing column names that sounded logical but did not exist (e.g., querying `order_total_usd` when the schema actually stored `unit_price_cents` and `quantity`), or inventing imaginary intermediate join tables. The SQL compiled cleanly, but returned completely incorrect numbers.
- **The Dangerous Mutation Scare:** While running exploratory queries, I typed a casual prompt: _"Clear out abandoned demo orders from last quarter."_ The model returned an unconstrained `DELETE FROM orders WHERE status = 'abandoned'`. Had that been a production database, critical business records would have vanished in milliseconds.

That near-miss was my turning point. I realized that production text-to-SQL cannot be a naive string-interpolation wrapper over raw database drivers. It demands an intelligent, zero-trust middleware architecture that guarantees relational accuracy and safety before executing a single line of SQL.

That realization led me to build **SchemaAI** ([ai-schema.netlify.app](https://ai-schema.netlify.app/)).

---

## 2. The Architectural Blueprint: Decoupling Generation from Execution

To solve these vulnerabilities, I designed SchemaAI around a fundamental rule: **never trust raw LLM output, and never send unpruned schemas into the context window.**

![SchemaAI Architecture Pipeline](/images/blogs/schema-ai-pipeline.png)

I structured the system into four decoupled layers:

1. **Client Workbench (Next.js 16 & React Flow):** An interactive developer console where users connect database credentials, inspect an auto-generated Entity-Relationship Diagram (ERD), visually isolate table subgraphs, and monitor query telemetry.
2. **Orchestration Gateway (FastAPI & LangGraph):** A cyclical state machine that manages intent validation, dialect compilation (PostgreSQL, MySQL, MongoDB, GraphQL), and automated error correction.
3. **Zero-Trust Guardrail Engine (SQLGlot & AST Parsers):** A deterministic inspection layer that validates Abstract Syntax Trees (AST), blocks destructive statements, enforces read limits, and runs dry-run execution checks.
4. **Isolated Database Runtime (Async Python Drivers):** Sandboxed connection pools restricted to read-only roles, bounded by strict 3,000ms query timeouts and cryptographic audit trails.

---

## 3. The Breakthrough: Visual Context Pruning with React Flow

My biggest early hurdle was context bloat. In an enterprise schema with fifty tables, serializing every column, type constraint, and index into the prompt burned an unsustainable number of tokens and triggered severe "lost in the middle" attention degradation.

I experimented with vector embeddings (RAG) to retrieve relevant tables based on the user's prompt. However, pure vector retrieval frequently missed crucial join tables that had low semantic similarity to the prompt keywords (e.g., missing an intermediate `order_items` join table when asking about `users` and `products`).

The breakthrough came when I stopped treating **React Flow** as just UI eye-candy and transformed it into a **human-in-the-loop context filter**.

![Visual Context Pruning: React Flow Subgraph Isolation](/images/blogs/schema-ai-visual-pruning.png)

Here is how the visual pruning mechanism works:

1. **Topological Graph Ingestion:** When a user connects their database, SchemaAI queries system catalogs (`information_schema.columns` and `pg_constraint`), turning foreign keys into Bezier edges and tables into interactive React Flow nodes.
2. **Sub-Graph Isolation:** When an engineer selects a target table, SchemaAI automatically identifies its 1-hop and 2-hop relational neighborhood (e.g., `users` ↔ `orders` ↔ `order_items`), while pruning away irrelevant noise like `audit_logs`, `session_tokens`, and analytics shards.
3. **Targeted DDL Serialization:** Only the selected subgraph's schema is formatted into the active context payload.

The impact was immediate: input prompt tokens dropped from **over 85,000 down to roughly 1,200 tokens per interaction**—a direct **~85% cost and latency reduction**. Because the model only sees the exact tables involved in the relational path, cross-schema join hallucinations dropped to zero.

---

## 4. Engineering the State Machine: LangGraph & Bounded Self-Correction

In production, linear prompt chains (`Prompt -> LLM -> Output`) break the moment a database dialect nuance or type mismatch occurs. If Postgres requires explicit type casting (`date::text`) or a table name needs double quotes, a linear pipeline simply crashes.

To make SchemaAI resilient, I rebuilt the orchestration layer as a cyclical state machine using **LangGraph**.

![LangGraph State Machine & Bounded Self-Correction Loop](/images/blogs/schema-ai-langgraph-state-machine.png)

### The State Machine Lifecycle (`AgentState`)

- **Node 1: Intent & Relevance Gate:** Intercepts general trivia, off-topic prompts, or injection attempts before consuming reasoning tokens.
- **Node 2: Dialect Generator Node:** Compiles the query strictly grounded in the pruned React Flow schema context.
- **Node 3: Static AST Guardrail:** Uses SQLGlot to inspect the query's Abstract Syntax Tree. Any token matching `DROP`, `DELETE`, `UPDATE`, `ALTER`, or `TRUNCATE` is immediately halted.
- **Node 4: Database Dry-Run (`EXPLAIN` Plan):** Dispatches an `EXPLAIN` query against the live database engine. This validates syntax, verifies indexes, and checks table relations without reading a single row of data.
- **Node 5: Bounded Self-Correction Loop:** If the database engine returns an error, LangGraph extracts the engine diagnostic message, injects it back into the state dictionary, and routes back to Node 2. The loop is strictly capped at `max_attempts = 2` to prevent infinite token cycles.

### The Routing Implementation

Here is the core conditional routing logic running inside SchemaAI's orchestration engine:

```python
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
import sqlglot

class AgentState(TypedDict):
    prompt: str
    pruned_schema: dict
    generated_query: Optional[str]
    query_type: str  # "SQL" | "GraphQL"
    error: Optional[str]
    attempts: int
    is_safe: bool

def validate_ast_guardrails(state: AgentState) -> AgentState:
    query = state.get("generated_query", "")
    try:
        parsed = sqlglot.parse_one(query)
        # Deterministically block destructive DML and DDL commands
        destructive_types = (
            sqlglot.exp.Drop,
            sqlglot.exp.Delete,
            sqlglot.exp.Update,
            sqlglot.exp.AlterTable
        )
        if isinstance(parsed, destructive_types):
            return {**state, "is_safe": False, "error": "Destructive mutation blocked by guardrail."}
        return {**state, "is_safe": True, "error": None}
    except Exception as e:
        return {**state, "is_safe": False, "error": f"AST Parse Failure: {str(e)}"}

def route_validation(state: AgentState) -> str:
    if not state["is_safe"]:
        return END  # Immediately halt on mutation detection
    if state["error"] and state["attempts"] < 2:
        return "generator_node"  # Route error diagnostic back for self-correction
    if state["error"] and state["attempts"] >= 2:
        return END  # Exhausted retries: surface clean failure diagnostic
    return "execute_node"

# Assemble Directed Graph
workflow = StateGraph(AgentState)
workflow.add_node("intent_node", check_intent)
workflow.add_node("generator_node", generate_query)
workflow.add_node("guardrail_node", validate_ast_guardrails)
workflow.add_node("execute_node", execute_dry_run)

workflow.set_entry_point("intent_node")
workflow.add_edge("intent_node", "generator_node")
workflow.add_edge("generator_node", "guardrail_node")
workflow.add_conditional_edges("guardrail_node", route_validation)
workflow.add_edge("execute_node", END)

app = workflow.compile()
```

---

## 5. Defensive Guardrails: Preventing Runaway Database Compute

Early on, I learned that prompt instructions like _"Please generate safe queries"_ are completely ineffective for production security. Prompts can be bypassed by ambiguous phrasing or jailbreaks.

To protect the connected databases, I baked three strict deterministic rules into the compilation pipeline:

### 1. Mandatory Limit Injection

Unbounded queries can lock table partitions and exhaust server memory. If a user asks for general exploratory data without specifying a boundary, SchemaAI automatically rewrites the query AST to inject a `LIMIT 50` clause.

```sql
-- Unsafe query: risks full-table scan across millions of records
SELECT customer_id, total_spend FROM customer_lifetime_value;

-- Enforced SchemaAI AST Rewrite: bounds database memory footprint
SELECT customer_id, total_spend FROM customer_lifetime_value
ORDER BY total_spend DESC
LIMIT 50;
```

### 2. Prohibition of Wildcard Projections

Tables with wide JSONB payloads or binary columns quickly saturate database network bandwidth. SchemaAI enforces explicit column projections, rejecting `SELECT *` across all dialects in favor of named schema attributes.

### 3. Structured Output Contracts

Rather than returning raw text, the generator emits a strict JSON Schema:

- `query`: The sanitized SQL or GraphQL statement.
- `explanation`: A concise breakdown of the join paths and filtering logic.
- `warnings`: Flags highlighting heavy multi-table joins or unindexed column filters.

This contract ensures the developer can review the query rationale and cost indicators in the dual-pane editor **before** triggering live data retrieval.

---

## 6. Key Takeaways from Building SchemaAI

Designing and deploying SchemaAI taught me three fundamental lessons about applied AI systems engineering:

1. **Deterministic Guardrails Trump Bigger Models:** Trying to solve query safety with fine-tuning or larger prompts will always leave room for edge-case failures. A lightweight AST parser like SQLGlot guarantees 100% protection against destructive mutations.
2. **Context Pruning Is the Ultimate Cost Optimization:** By letting engineers visually isolate active table subgraphs with React Flow, I cut prompt token overhead by ~85% while dramatically improving foreign-key accuracy.
3. **Developer Trust Requires Transparency:** Engineers will not adopt AI tools that act like opaque black boxes. Providing interactive schema visualization, visible dry-run execution checks, and syntax diffs turns natural language into a transparent productivity multiplier.

SchemaAI is live and open for experimentation at [`Schema-AI`](https://ai-schema.netlify.app/). The source code and architectural pipelines are available on GitHub at [`SchemaAI`](https://github.com/PrateekSingh2/SchemaAI). I welcome technical feedback, pull requests, and architectural discussions!
