"use client";

import * as React from "react";
import { Code2, Terminal, Workflow, Cpu, Monitor, ChevronRight } from "lucide-react";

const SKILL_ICON: Record<string, string> = {
  "C++":            "cpp",
  "Python":         "python",
  "Java":           "java",
  "JavaScript":     "js",
  "TypeScript":     "ts",
  "Next.js":        "nextjs",
  "React":          "react",
  "Node.js":        "nodejs",
  "PostgreSQL":     "postgresql",
  "Docker":         "docker",
  "Git":            "git",
  "Linux":          "linux",
  "HTML":           "html",
  "CSS":            "css",
};

function SkillIcon({ slug }: { slug: string }) {
  const url = `https://skillicons.dev/icons?i=${slug}&theme=dark`;
  return (
    <img
      src={url}
      alt={slug}
      width={20}
      height={20}
      className="rounded-[4px] select-none shrink-0"
      loading="lazy"
    />
  );
}

const skillCategories = [
  {
    id: "languages",
    name: "Languages",
    description: "Syntaxes and compilers I speak fluently.",
    icon: <Code2 className="w-4 h-4" />,
    skills: ["C++", "Java", "Python", "JavaScript", "TypeScript"],
    color: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20",
  },
  {
    id: "web",
    name: "Web & Backend",
    description: "Frameworks and datastores for modern applications.",
    icon: <Monitor className="w-4 h-4" />,
    skills: ["Next.js", "React", "Node.js", "PostgreSQL", "HTML", "CSS"],
    color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "devops",
    name: "DevOps & Tools",
    description: "Infrastructure, virtualization, and version control.",
    icon: <Terminal className="w-4 h-4" />,
    skills: ["Docker", "Git", "Linux"],
    color: "from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/20",
  },
  {
    id: "algo",
    name: "Algorithms & DSA",
    description: "Core problem-solving and computer science paradigms.",
    icon: <Workflow className="w-4 h-4" />,
    skills: ["Dynamic Programming", "Graphs", "Trees", "Segment Trees", "Tries", "Hashing"],
    color: "from-yellow-500/20 to-yellow-600/5 text-yellow-400 border-yellow-500/20",
  },
  {
    id: "core",
    name: "Core CS Fundamentals",
    description: "Theoretical systems engineering and system design.",
    icon: <Cpu className="w-4 h-4" />,
    skills: ["Operating Systems", "Computer Networks", "DBMS", "OOP", "System Design"],
    color: "from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20",
  },
];

export function CoreSkills() {
  const [activeCategory, setActiveCategory] = React.useState(skillCategories[0]);

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="skills">
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" /> Skills
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Technical competencies across software engineering, algorithms, and systems.
        </p>
      </div>

      {/* Split-pane Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[340px]">
        {/* Left Side: Sidebar / Mobile horizontal scroll navigation */}
        <div className="md:col-span-4 flex md:flex-col overflow-x-auto pb-2 md:pb-0 scrollbar-none gap-2 shrink-0">
          {skillCategories.map((cat) => {
            const isActive = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg font-mono text-xs transition-all text-left border shrink-0 ${
                  isActive
                    ? "bg-primary/10 border-primary/30 text-primary font-bold shadow-sm"
                    : "bg-card/20 border-border/30 text-muted-foreground hover:bg-card/40 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? "text-primary animate-pulse" : "text-muted-foreground"}>
                    {cat.icon}
                  </span>
                  <span className="whitespace-nowrap">{cat.name}</span>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 hidden md:block transition-transform duration-300 ${
                    isActive ? "translate-x-1 text-primary" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Side: Skill detail board */}
        <div className="md:col-span-8 bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          {/* Top colored indicator line based on active category */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${activeCategory.color.split(' ')[0]} to-transparent`} />
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`p-2 rounded-lg bg-background/50 border border-border/30 text-primary`}>
                {activeCategory.icon}
              </span>
              <h3 className="text-lg font-bold font-mono text-foreground">
                {activeCategory.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-mono mb-6 leading-relaxed">
              {activeCategory.description}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {activeCategory.skills.map((skill) => {
                const slug = SKILL_ICON[skill];
                return (
                  <div
                    key={skill}
                    className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border/30 hover:border-primary/30 rounded-lg shadow-sm hover:shadow-primary/5 transition-all duration-300 cursor-default"
                  >
                    {slug && <SkillIcon slug={slug} />}
                    <span className="text-[11px] font-mono text-muted-foreground hover:text-foreground font-bold transition-colors">
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border/10 flex items-center justify-between text-[10px] font-mono text-muted-foreground/50">
            <span>System: Linux/UNIX</span>
            <span>Compilation status: OK</span>
          </div>
        </div>
      </div>
    </section>
  );
}
