"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { preloadImages } from "@/lib/mediaCache";
import {
  Cpu,
  Database,
  Globe,
  Layers,
  Boxes,
} from "lucide-react";

export interface SkillItem {
  id: string;
  name: string;
  slug?: string;
  customLogoUrl?: string;
  description: string;
  proficiency: "Expert" | "Advanced" | "Proficient";
  customIcon?: React.ReactNode;
}

const MONO_SLUGS = new Set([
  "nextdotjs",
  "github",
  "express",
]);

// Merged, interview-centric technical stack for engineering showcase
const SKILL_DATABASE: SkillItem[] = [
  // Core Languages
  {
    id: "cpp",
    name: "C++",
    slug: "cplusplus",
    proficiency: "Expert",
    description:
      "STL containers, pointers & memory management, low-level algorithm optimization, competitive programming.",
  },
  {
    id: "java",
    name: "Java",
    customLogoUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg",
    proficiency: "Advanced",
    description:
      "OOP design patterns, JVM memory model, multi-threading & concurrency, collections framework.",
  },
  {
    id: "python",
    name: "Python",
    slug: "python",
    proficiency: "Expert",
    description:
      "Data structures, asynchronous programming, backend APIs, automation, AI/ML scripting.",
  },
  {
    id: "ts",
    name: "TypeScript",
    slug: "typescript",
    proficiency: "Expert",
    description:
      "Strict typing, generics, utility types, AST transformations, enterprise fullstack development.",
  },
  {
    id: "js",
    name: "JavaScript",
    customLogoUrl: "/icons/javascript.svg",
    proficiency: "Expert",
    description:
      "V8 engine, event loop execution model, closures, async/await, DOM & web APIs.",
  },

  // Fullstack & Backend Core
  {
    id: "react",
    name: "React",
    customLogoUrl: "/icons/react.svg",
    proficiency: "Expert",
    description:
      "Fiber reconciler, custom hooks, component lifecycle, virtual DOM tuning, state management.",
  },
  {
    id: "nextjs",
    name: "Next.js",
    slug: "nextdotjs",
    proficiency: "Expert",
    description:
      "App Router, Server Components (RSC), SSR & SSG pipelines, edge runtime optimization.",
  },
  {
    id: "nodejs",
    name: "Node.js",
    customLogoUrl: "/icons/nodejs.svg",
    proficiency: "Advanced",
    description:
      "Event-driven asynchronous I/O, streams & buffers, cluster module, REST microservices.",
  },
  {
    id: "express",
    name: "Express",
    slug: "express",
    proficiency: "Advanced",
    description:
      "RESTful architecture, middleware pipelines, route handling, JWT auth security.",
  },

  // Databases & Storage
  {
    id: "postgres",
    name: "PostgreSQL",
    slug: "postgresql",
    proficiency: "Advanced",
    description:
      "ACID transactions, relational schema design, indexing (B-Tree/GIN), query planning & optimization.",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    slug: "mongodb",
    proficiency: "Advanced",
    description:
      "NoSQL document modeling, aggregation pipelines, replica sets, indexing strategies.",
  },

  // CS Fundamentals & Systems Engineering
  {
    id: "sysdesign",
    name: "System Design",
    customIcon: <Layers className="w-5 h-5" />,
    proficiency: "Advanced",
    description:
      "Distributed systems, horizontal scaling, caching strategies (Redis), load balancing, CAP theorem, microservices.",
  },
  {
    id: "oops",
    name: "OOPs",
    customIcon: <Boxes className="w-5 h-5" />,
    proficiency: "Expert",
    description:
      "Abstraction, encapsulation, inheritance, polymorphism, SOLID principles, design patterns.",
  },
  {
    id: "os",
    name: "OS & Kernel",
    customIcon: <Cpu className="w-5 h-5" />,
    proficiency: "Advanced",
    description:
      "Process scheduling, IPC, virtual memory & paging, multi-threading, synchronization & deadlocks.",
  },
  {
    id: "dbms",
    name: "DBMS Core",
    customIcon: <Database className="w-5 h-5" />,
    proficiency: "Advanced",
    description:
      "B+ trees, concurrency control (2PL, MVCC), Write-Ahead Logging (WAL), relational normalization.",
  },
  {
    id: "cn",
    name: "Networks",
    customIcon: <Globe className="w-5 h-5" />,
    proficiency: "Advanced",
    description:
      "OSI & TCP/IP models, HTTP/1.1 vs HTTP/2/3, WebSockets, TLS/SSL handshake, DNS resolution.",
  },

  // AI & GenAI Systems
  {
    id: "langchain",
    name: "LangChain",
    customLogoUrl: "/icons/langchain.svg",
    proficiency: "Advanced",
    description:
      "LLM chains, prompt templates, LCEL composition, retrieval pipelines, tool calling.",
  },
  {
    id: "langgraph",
    name: "LangGraph",
    customLogoUrl: "/icons/langgraph.svg",
    proficiency: "Advanced",
    description:
      "Cyclic agentic workflows, multi-agent coordination, human-in-the-loop, stateful graph execution.",
  },
  {
    id: "rag-vector",
    name: "RAG / Vector DB",
    customLogoUrl: "/icons/rag-vector.svg",
    proficiency: "Advanced",
    description:
      "Vector embeddings, cosine similarity, semantic search, hybrid re-ranking, chunking strategies.",
  },

  // Cloud & DevOps Infrastructure
  {
    id: "docker",
    name: "Docker",
    slug: "docker",
    proficiency: "Advanced",
    description:
      "Container virtualization, multi-stage Dockerfiles, network isolation, compose orchestrations.",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    slug: "kubernetes",
    proficiency: "Proficient",
    description:
      "Pod lifecycle, deployments, Services & Ingress, horizontal pod autoscaling (HPA), cluster architecture.",
  },
  {
    id: "aws-ec2",
    name: "AWS EC2",
    customLogoUrl: "/icons/aws-ec2.svg",
    proficiency: "Advanced",
    description:
      "Virtual compute instances, VPC networking, security groups, auto-scaling, cloud architecture.",
  },
  {
    id: "aws-s3",
    name: "AWS S3",
    customLogoUrl: "/icons/aws-s3.svg",
    proficiency: "Advanced",
    description:
      "Object storage architecture, bucket policies, CORS, lifecycle management, static asset hosting.",
  },
  {
    id: "linux",
    name: "Linux",
    customLogoUrl: "/icons/linux.svg",
    proficiency: "Advanced",
    description:
      "Shell scripting (Bash), systemctl service management, permissions & ACLs, process debugging (top/htop/strace).",
  },
  {
    id: "git",
    name: "Git",
    slug: "git",
    proficiency: "Expert",
    description:
      "Internal DAG architecture, branch & rebase strategies, merge conflict resolution, submodules.",
  },
  {
    id: "github",
    name: "GitHub",
    slug: "github",
    proficiency: "Expert",
    description:
      "CI/CD pipelines with GitHub Actions, PR review workflows, release management, security scanning.",
  },
];

function SkillBadge({
  skill,
  isDark,
  align = "center",
}: {
  skill: SkillItem;
  isDark: boolean;
  align?: "left" | "center" | "right";
}) {
  const [imgError, setImgError] = React.useState(false);

  const iconUrl = skill.customLogoUrl
    ? skill.customLogoUrl
    : skill.slug
      ? MONO_SLUGS.has(skill.slug)
        ? `https://cdn.simpleicons.org/${skill.slug}/${isDark ? "ffffff" : "000000"}`
        : `https://cdn.simpleicons.org/${skill.slug}`
      : null;

  return (
    <div className="relative group/tech">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-transparent border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/40 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] flex items-center justify-center p-2 sm:p-2.5 transition-all duration-200 hover:scale-105 shadow-sm">
        {iconUrl && !imgError ? (
          <img
            src={iconUrl}
            alt={skill.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain transition-transform duration-200 group-hover/tech:scale-110"
            loading="lazy"
          />
        ) : skill.customIcon ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover/tech:text-foreground transition-colors [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
            {skill.customIcon}
          </div>
        ) : (
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {skill.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Clean Tooltip with intelligent alignment preventing cutoffs */}
      <div
        className={`absolute -top-9 pointer-events-none opacity-0 group-hover/tech:opacity-100 transition-all duration-150 ease-out transform translate-y-1 group-hover/tech:translate-y-0 z-30 drop-shadow-md ${
          align === "left"
            ? "left-0 translate-x-0"
            : align === "right"
            ? "right-0 translate-x-0"
            : "left-1/2 -translate-x-1/2"
        }`}
      >
        <div className="px-2 py-0.5 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 text-white text-[10.5px] font-mono font-medium whitespace-nowrap border border-white/10 shadow-lg">
          {skill.name}
        </div>
        <div
          className={`w-1.5 h-1.5 bg-zinc-900/95 dark:bg-zinc-800/95 rotate-45 -mt-0.5 border-r border-b border-white/10 ${
            align === "left"
              ? "ml-3.5"
              : align === "right"
              ? "mr-3.5 ml-auto"
              : "mx-auto"
          }`}
        />
      </div>
    </div>
  );
}

export function CoreSkills() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  React.useEffect(() => {
    // Preload all SVG icons into memory cache for zero latency
    const urls = SKILL_DATABASE.map((s) => {
      if (s.customLogoUrl) return s.customLogoUrl;
      if (!s.slug) return null;
      return MONO_SLUGS.has(s.slug)
        ? `https://cdn.simpleicons.org/${s.slug}/${isDark ? "ffffff" : "000000"}`
        : `https://cdn.simpleicons.org/${s.slug}`;
    }).filter(Boolean) as string[];
    preloadImages(urls);
  }, [isDark]);

  return (
    <section
      className="py-14 px-4 max-w-3xl mx-auto w-full relative"
      id="skills"
    >
      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-foreground mb-6">
        Skills &amp; Tech Stack
      </h2>

      {/* Pure Logos Row - Matching Experience Section Tech Stack Holding */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {SKILL_DATABASE.map((skill, idx) => (
          <SkillBadge
            key={skill.id}
            skill={skill}
            isDark={isDark}
            align={
              idx === 0
                ? "left"
                : idx === SKILL_DATABASE.length - 1
                ? "right"
                : "center"
            }
          />
        ))}
      </div>
    </section>
  );
}
