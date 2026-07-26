"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, GitBranch, ExternalLink, TerminalSquare, ChevronRight, ShieldAlert, Zap, FileText, Code2, Layers } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  challenges: string;
  metrics: string;
  tech: string[];
  github: string;
  live: string;
};

export function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: "formforge",
      title: "FormForge: AI-Assisted Dynamic Form Builder",
      shortDesc: "A web application allowing users to create dynamic forms with AI-assisted prompt interactions.",
      description: "FormForge simplifies complex multi-step form creation using generative AI prompts, customizable field validation schemas, and real-time live preview rendering.",
      challenges: "Ensuring real-time state consistency across nested form structures while maintaining sub-50ms reactive input updates. Integrating LLM prompt parsing for structured JSON schema generation.",
      metrics: "Reduced form generation setup time by 50% with 95% prompt completion accuracy across test user cohorts.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
      github: "https://github.com/PrateekSingh2/formsforge",
      live: "https://formsforge-coral.vercel.app/",
    },
    {
      id: "blo",
      title: "BLO: Virtual Voter Card System",
      shortDesc: "A desktop application engineered for local generation and encryption of virtual voter cards.",
      description: "BLO (Booth Level Officer) virtual voter system provides secure local ID generation, automated barcode creation, and record management with offline-first MySQL storage.",
      challenges: "Designing an offline-first desktop UI with Tkinter, securing encrypted local databases, and generating vector print-ready PDF export cards.",
      metrics: "Streamlined local election voter verification workflow with 100% offline uptime and zero data leakage.",
      tech: ["Python", "Tkinter", "MySQL", "ReportLab"],
      github: "https://github.com/PrateekSingh2/BLO",
      live: "", 
    },
    {
      id: "portfolio",
      title: "Real-Time Algorithmic Developer Portfolio",
      shortDesc: "A high-performance portfolio featuring live GraphQL scraping, Recharts analytics, and micro-interactions.",
      description: "Architected with Next.js App Router, custom REST/GraphQL API proxy routes, RegExp HTML scrapers for competitive programming platforms, and real-time commit feeds.",
      challenges: "Scraping non-API competitive profiles (CodeChef HTML script regex parsing), optimizing client bundle size, and ensuring 60fps glassmorphism rendering across mobile browsers.",
      metrics: "100% TypeScript type safety, 0 runtime lint errors, sub-second API caching with Next.js SWR revalidation.",
      tech: ["Next.js 15", "TypeScript", "Recharts", "Tailwind CSS", "GraphQL"],
      github: "https://github.com/PrateekSingh2/Portfolio",
      live: "https://portfolio-prateeksingh.vercel.app/",
    }
  ];

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="projects">
      <div className="mb-10">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-primary" /> Featured Projects
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Deep dives into complex software systems and engineering challenges. Tap any card for full details.
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
          >
            <Card 
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View deep dive for ${project.title}`}
              className="bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/50 hover:bg-card/60 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Top Ambient Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="p-6 md:p-7 flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 group-hover:bg-primary/20 transition-all">
                        <TerminalSquare className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold font-mono leading-tight text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    
                    {/* View Deep Dive Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-mono text-xs font-bold transition-all border border-primary/20 cursor-pointer self-start sm:self-auto"
                    >
                      <span>View Deep Dive</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-foreground/80 mb-5 leading-relaxed font-mono">
                    {project.shortDesc}
                  </p>
                </div>
                
                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech.map((t) => (
                    <span 
                      key={t} 
                      className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-primary/5 text-primary/90 border border-primary/15 font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Project Deep-Dive Modal Overlay (Shadcn Dialog) */}
      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="w-[calc(100%-1.5rem)] max-w-3xl md:max-w-4xl lg:max-w-5xl bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl p-5 md:p-8 rounded-2xl border-t-2 border-t-primary/60 transition-all duration-300 overflow-hidden">
            <DialogHeader className="pb-3 border-b border-border/30">
              <DialogTitle className="text-base sm:text-lg md:text-xl font-mono flex items-start gap-2.5 text-foreground font-bold leading-snug">
                <TerminalSquare className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                <span className="break-words font-extrabold">{selectedProject.title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                Detailed architecture breakdown, technical challenges, and key impact.
              </DialogDescription>
            </DialogHeader>

            {/* Modal Body */}
            <div className="py-3 font-mono space-y-5 text-xs max-h-[70vh] md:max-h-[75vh] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
              
              {/* Overview */}
              <div>
                <h4 className="text-xs text-primary mb-1.5 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <FileText className="w-4 h-4" /> Project Overview
                </h4>
                <p className="text-foreground/90 leading-relaxed bg-muted/20 p-4 sm:p-5 rounded-2xl border border-border/30 break-words font-sans text-xs sm:text-sm shadow-inner">
                  {selectedProject.description}
                </p>
              </div>

              {/* Challenges & Impact (2 Columns on Desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 sm:p-5 space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <h4 className="text-xs text-primary flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" /> Engineering Challenges
                  </h4>
                  <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed break-words font-sans">
                    {selectedProject.challenges}
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 sm:p-5 space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <h4 className="text-xs text-primary flex items-center gap-1.5 font-bold">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" /> Impact & Benchmark Metrics
                  </h4>
                  <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed break-words font-sans">
                    {selectedProject.metrics}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="p-4 rounded-2xl bg-muted/15 border border-border/25">
                <h4 className="text-xs text-primary mb-2 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-4 h-4" /> Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <Badge key={t} variant="outline" className="font-mono text-[10.5px] sm:text-xs px-3 py-1 rounded-xl bg-primary/10 text-primary border-primary/20 font-bold hover:bg-primary/20 transition-colors">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Links */}
            <div className="pt-3.5 border-t border-border/30 flex flex-wrap items-center justify-end gap-3">
              {selectedProject.github && (
                <a 
                  href={selectedProject.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={buttonVariants({ variant: "outline", size: "sm", className: "font-mono gap-2 text-xs cursor-pointer rounded-xl font-bold border-border/50 hover:bg-muted" })}
                >
                  <GitBranch className="w-4 h-4 text-primary" /> View Source Code
                </a>
              )}
              {selectedProject.live && (
                <a 
                  href={selectedProject.live} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={buttonVariants({ size: "sm", className: "font-mono gap-2 text-xs cursor-pointer rounded-xl font-bold shadow-md" })}
                >
                  <ExternalLink className="w-4 h-4" /> Launch Live Application
                </a>
              )}
            </div>

          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
