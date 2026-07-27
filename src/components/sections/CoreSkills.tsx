"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { preloadImages } from "@/lib/mediaCache";
import {
  Code2,
  Terminal,
  Workflow,
  Cpu,
  Monitor,
  Sparkles,
  Layers,
  Search,
  Database,
  Network,
  Globe,
  BrainCircuit,
  Server,
} from "lucide-react";

export interface SkillItem {
  id: string;
  name: string;
  category: "languages" | "web" | "aiml" | "devops" | "cs";
  slug?: string;
  customLogoUrl?: string;
  description: string;
  proficiency: "Expert" | "Advanced" | "Proficient";
  customIcon?: React.ReactNode;
  highlighted?: boolean;
}

const MONO_SLUGS = new Set([
  "nextdotjs",
  "github",
  "vercel",
  "express",
  "prisma",
]);

const SKILL_DATABASE: SkillItem[] = [
  // Row 1 / Languages & Web Core
  {
    id: "ts",
    name: "TypeScript",
    category: "languages",
    slug: "typescript",
    proficiency: "Expert",
    description:
      "Strict typing, generics, AST transformations, enterprise fullstack development.",
  },
  {
    id: "js",
    name: "JavaScript",
    category: "languages",
    slug: "javascript",
    proficiency: "Expert",
    description:
      "ES6+, async/await queues, event loop optimization, DOM execution contexts.",
  },
  {
    id: "java",
    name: "Java",
    category: "languages",
    customLogoUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg",
    proficiency: "Advanced",
    description:
      "OOP patterns, JVM tuning, multi-threading, competitive programming.",
  },
  {
    id: "cpp",
    name: "C++",
    category: "languages",
    slug: "cplusplus",
    proficiency: "Expert",
    description:
      "STL, memory management, low-level algorithm optimization, competitive programming.",
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    slug: "python",
    proficiency: "Expert",
    description:
      "Data science, AI models, PyTorch, automation scripts, backend services.",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "web",
    slug: "nextdotjs",
    proficiency: "Expert",
    description:
      "App Router, SSR, SSG, Server Actions, edge runtime optimization.",
  },
  {
    id: "react",
    name: "React",
    category: "web",
    slug: "react",
    proficiency: "Expert",
    description:
      "Custom hooks, Virtual DOM tuning, state management, concurrent rendering.",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "web",
    slug: "tailwindcss",
    proficiency: "Expert",
    description:
      "Design systems, responsive layouts, dark mode, custom animation utilities.",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "web",
    slug: "nodejs",
    proficiency: "Advanced",
    description:
      "Event-driven microservices, streams, REST APIs, asynchronous I/O.",
  },
  {
    id: "express",
    name: "Express",
    category: "web",
    slug: "express",
    proficiency: "Advanced",
    description:
      "RESTful architecture, middleware pipelines, JWT auth, routing.",
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "web",
    slug: "prisma",
    proficiency: "Advanced",
    description:
      "Type-safe ORM, migrations, schema modeling, relational data querying.",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "web",
    slug: "mongodb",
    proficiency: "Advanced",
    description:
      "Document storage, aggregation frameworks, indexing, NoSQL schemas.",
  },

  // Row 2 / AI, ML & Data
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "web",
    slug: "postgresql",
    proficiency: "Advanced",
    description:
      "ACID transactions, relational indexing, complex joins, query planning.",
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "web",
    slug: "mysql",
    proficiency: "Advanced",
    description:
      "Relational database management, stored procedures, indexing, relational design.",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "aiml",
    slug: "huggingface",
    proficiency: "Proficient",
    description: "Transformer models, tokenizers, LLM fine-tuning, embeddings.",
  },
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    slug: "docker",
    proficiency: "Advanced",
    description:
      "Containerization, Dockerfiles, multi-stage builds, compose orchestration.",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "devops",
    slug: "kubernetes",
    proficiency: "Proficient",
    description:
      "Cluster management, pod deployments, service routing, scaling.",
  },
  {
    id: "git",
    name: "Git",
    category: "devops",
    slug: "git",
    proficiency: "Expert",
    description:
      "Branching strategies, rebase workflows, version control, submodules.",
  },
  {
    id: "github",
    name: "GitHub",
    category: "devops",
    slug: "github",
    proficiency: "Expert",
    description:
      "GitHub Actions CI/CD pipelines, PR workflows, code security audits.",
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "devops",
    slug: "visualstudiocode",
    proficiency: "Expert",
    description:
      "Custom configurations, remote SSH debugging, extension ecosystems.",
  },

  // Row 3 / Cloud, DevOps & CS Core
  {
    id: "vercel",
    name: "Vercel",
    category: "devops",
    slug: "vercel",
    proficiency: "Expert",
    description:
      "Edge deployment pipelines, analytics, preview environments, domain routing.",
  },
  {
    id: "Netlify",
    name: "Netlify",
    category: "devops",
    slug: "netlify",
    proficiency: "Expert",
    description:
      "Edge deployment pipelines, analytics, preview environments, domain routing.",
  },
  {
    id: "linux",
    name: "Linux",
    category: "devops",
    slug: "linux",
    proficiency: "Advanced",
    description:
      "Bash scripting, systemctl services, permission models, shell utilities.",
  },
  {
    id: "html",
    name: "HTML5",
    category: "web",
    slug: "html5",
    proficiency: "Expert",
    description:
      "Semantic markup, accessibility (a11y), DOM structure, Web APIs.",
  },
  {
    id: "css",
    name: "CSS3",
    category: "web",
    slug: "css3",
    proficiency: "Expert",
    description:
      "Flexbox, CSS Grid, custom properties, responsive design, animations.",
  },
  {
    id: "dp",
    name: "Dynamic Prog.",
    category: "cs",
    customIcon: <Workflow className="w-5 h-5" />,
    proficiency: "Expert",
    description:
      "Memoization, tabulations, state transitions, subproblem optimization.",
  },
  {
    id: "graphs",
    name: "Graphs & Trees",
    category: "cs",
    customIcon: <Network className="w-5 h-5" />,
    proficiency: "Expert",
    description:
      "Dijkstra, Segment Trees, Trie structures, BFS/DFS, Union-Find.",
  },
  {
    id: "sysdesign",
    name: "Low Level Design",
    category: "cs",
    customIcon: <Layers className="w-5 h-5" />,
    proficiency: "Proficient",
    description:
      "Load balancing, caching, sharding, distributed consensus, microservices.",
  },
  {
    id: "os",
    name: "OS & Kernel",
    category: "cs",
    customIcon: <Cpu className="w-5 h-5" />,
    proficiency: "Advanced",
    description:
      "Process synchronization, memory paging, deadlocks, thread scheduling.",
  },
  {
    id: "dbms",
    name: "DBMS Core",
    category: "cs",
    customIcon: <Database className="w-5 h-5" />,
    proficiency: "Advanced",
    description:
      "B+ Trees, concurrency control, WAL logs, normalization, query optimization.",
  },
  {
    id: "cn",
    name: "Networks",
    category: "cs",
    customIcon: <Globe className="w-5 h-5" />,
    proficiency: "Advanced",
    description:
      "TCP/IP stack, HTTP/2 & HTTP/3, sockets, TLS/SSL, DNS resolution.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All", icon: <Sparkles className="w-3.5 h-3.5" /> },
  {
    id: "languages",
    label: "Languages",
    icon: <Code2 className="w-3.5 h-3.5" />,
  },
  { id: "web", label: "Web & DB", icon: <Monitor className="w-3.5 h-3.5" /> },
  {
    id: "aiml",
    label: "AI & ML",
    icon: <BrainCircuit className="w-3.5 h-3.5" />,
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    icon: <Server className="w-3.5 h-3.5" />,
  },
  { id: "cs", label: "CS & Systems", icon: <Cpu className="w-3.5 h-3.5" /> },
];

function SkillIconBadge({
  skill,
  isSelected,
  onSelect,
  isDark,
}: {
  skill: SkillItem;
  isSelected: boolean;
  onSelect: () => void;
  isDark: boolean;
}) {
  const [imgError, setImgError] = React.useState(false);

  const iconUrl = skill.customLogoUrl
    ? skill.customLogoUrl
    : skill.slug
      ? MONO_SLUGS.has(skill.slug)
        ? `https://cdn.simpleicons.org/${skill.slug}/${isDark ? "ffffff" : "000000"}`
        : `https://cdn.simpleicons.org/${skill.slug}`
      : null;

  // Highlight only when user clicks specific skill tile
  const isHighlighted = isSelected;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-label={`Skill: ${skill.name}`}
      className={`relative group flex flex-col items-center justify-center rounded-2xl transition-all duration-300 select-none cursor-pointer p-2.5 sm:p-3 aspect-square ${
        isHighlighted
          ? "bg-primary/10 border border-primary shadow-[0_0_12px_rgba(56,189,248,0.2)] z-10"
          : "bg-card/60 border border-border/70 hover:border-border hover:bg-card/90"
      }`}
    >
      {/* Skill Logo */}
      <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center relative my-auto">
        {iconUrl && !imgError ? (
          <img
            src={iconUrl}
            alt={skill.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md"
            loading="lazy"
          />
        ) : skill.customIcon ? (
          <div
            className={`transition-colors ${
              isHighlighted
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
          >
            {skill.customIcon}
          </div>
        ) : (
          <div className="w-full h-full rounded-lg bg-muted flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
            {skill.name.slice(0, 3).toUpperCase()}
          </div>
        )}
      </div>

      {/* Skill Title */}
      <span
        className={`text-[10px] sm:text-[11px] font-mono mt-1 font-medium truncate max-w-full text-center px-1 ${
          isHighlighted
            ? "text-primary font-semibold"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

export function CoreSkills() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [selectedSkill, setSelectedSkill] = React.useState<SkillItem | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
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

  const filteredSkills = React.useMemo(() => {
    return SKILL_DATABASE.filter((skill) => {
      const matchesCategory =
        activeCategory === "all" || skill.category === activeCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section
      className="py-16 px-4 max-w-3xl mx-auto w-full relative"
      id="skills"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2 mb-1">
            <Code2 className="w-5 h-5 text-primary" /> Skills & Tech Stack
          </h2>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Languages, frameworks, tools, and systems engineering benchmarks.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/60 rounded-xl font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-mono text-xs transition-all duration-300 border cursor-pointer ${
                isActive
                  ? "bg-primary/10 border-primary/40 text-primary font-semibold shadow-sm"
                  : "bg-card/40 border-border/30 text-muted-foreground hover:bg-card/80 hover:text-foreground"
              }`}
            >
              <span
                className={isActive ? "text-primary" : "text-muted-foreground"}
              >
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tech Skill Logo Grid Container */}
      <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        {/* Skill Badges Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5 sm:gap-3 relative z-10">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;

            return (
              <SkillIconBadge
                key={skill.id}
                skill={skill}
                isSelected={isSelected}
                onSelect={() => setSelectedSkill(skill)}
                isDark={isDark}
              />
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="py-12 text-center text-muted-foreground font-mono text-xs">
            No technical skills found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </section>
  );
}
