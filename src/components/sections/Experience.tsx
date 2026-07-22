"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import * as React from "react";

export function Experience() {
  const experiences = [
    {
      role: "Founder & Lead Developer",
      company: "AlgoLib",
      duration: "Jan 2026 - Present",
      responsibilities: [
        "Founded and led the development of AlgoLib, a platform for algorithm enthusiasts.",
        "Designed and implemented core data structures visualizer for the platform.",
        "Developed a online judge system to host competitive programming contests.",
      ],
      impact: "Handled 5K+ daily events with 99.9% uptime.",
      tech: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker"],
    },
    {
      role: "Python Programmer",
      company: "DecodeLabs",
      duration: "Jun 2026 - July 2026",
      responsibilities: [
        "Developed a Python-based tool to calculate expenses and generate reports.",
        "Implemented data visualization features using Matplotlib.",
      ],
      impact: "Reduced manual effort by 30% through automated expense calculation and reporting.",
      tech: ["Python", "FastAPI", "SQLite"],
    }
  ];

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="experience">
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Experience
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          My professional journey and technical leadership roles.
        </p>
      </div>

      <div className="relative border-l border-border/40 ml-3 md:ml-6 space-y-12 pb-8">
        {/* Glow effect on the timeline line */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent -translate-x-[1px]" />
        
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12 group">
            {/* Timeline Node */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary/50 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300 ring-4 ring-background" />
            
            {/* Horizontal connection line */}
            <div className="absolute left-0 top-3 w-8 md:w-12 h-px bg-border/40 group-hover:bg-primary/30 transition-colors duration-300" />

            <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 md:p-8 hover:bg-card/50 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-primary/5 relative overflow-hidden">
              
              {/* Subtle top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold font-mono text-foreground mb-1 group-hover:text-primary transition-colors">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-mono text-muted-foreground">
                    <span className="text-primary/70 font-semibold mr-1">@</span> 
                    <span className="font-semibold text-foreground/80">{exp.company}</span>
                  </div>
                </div>
                
                <Badge variant="outline" className="w-fit font-mono text-xs bg-background/50 text-muted-foreground flex items-center gap-2 px-3 py-1.5 border-border/50 group-hover:border-primary/30 transition-colors">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" /> 
                  {exp.duration}
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground mb-6 font-mono">
                {exp.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary/40 shrink-0 group-hover:text-primary/70 transition-colors" />
                    <p className="leading-relaxed">{resp}</p>
                  </div>
                ))}
              </div>

              <div className="bg-background/40 border border-border/40 rounded-lg p-4 mb-6 font-mono text-xs text-foreground/80 flex items-start gap-3 group-hover:border-primary/20 transition-colors">
                <div className="p-1.5 bg-primary/10 rounded-md shrink-0">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div className="mt-1">
                  <span className="font-bold text-primary block mb-1 uppercase tracking-wider text-[10px]">Key Impact</span> 
                  {exp.impact}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {exp.tech.map((t) => (
                  <span 
                    key={t} 
                    className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-primary/5 text-primary/80 border border-primary/10 hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
