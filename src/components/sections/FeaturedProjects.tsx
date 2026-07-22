"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, GitBranch, ExternalLink, TerminalSquare, X, ChevronRight, ShieldAlert, Zap, FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  title: string;
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
      title: "FormForge: A Dynamic Form Builder with AI Assistance",
      description: "A web application that allows users to create dynamic forms with AI-assisted prompt based interactions.",
      challenges: "Ensuring real-time form rendering and maintaining state consistency across complex form structures. Integrating seamless LLM prompts for instantaneous UI generation.",
      metrics: "Achieved 95% user satisfaction by introducing AI assistance for form creation, reducing form-building time by 50%.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
      github: "https://github.com/PrateekSingh2/formsforge",
      live: "https://formsforge-coral.vercel.app/",
    },
    {
      title: "BLO: Virtual Voter Card making system",
      description: "A desktop application that allows users to create and save virtual voter cards.",
      challenges: "Implementing a user-friendly interface for card creation and ensuring data security for saved cards locally.",
      metrics: "Successfully created a system that allows users to generate and save virtual voter cards, enhancing accessibility and convenience.",
      tech: ["Python", "Tkinter", "MySQL"],
      github: "https://github.com/PrateekSingh2/BLO",
      live: "", 
    }
  ];

  // Close modal on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="projects">
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-primary" /> Featured Projects
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Deep dives into complex systems and engineering challenges.
        </p>
      </div>

      <div className="space-y-8">
        {projects.map((project, idx) => (
          <Card 
            key={idx} 
            onClick={() => setSelectedProject(project)}
            className="bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/50 hover:bg-card/60 transition-all duration-300 shadow-sm hover:shadow-primary/10 relative overflow-hidden group cursor-pointer"
          >
            {/* Top Accent line on Hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 md:p-8">
              {/* Header: Title */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 pb-5 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0 group-hover:bg-primary/20 transition-all">
                    <TerminalSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-mono leading-tight text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>
                
                {/* View Details Hint */}
                <div className="shrink-0 flex items-center text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                  View Deep Dive <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/80 mb-5 leading-relaxed font-mono">
                {project.description}
              </p>
              
              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span 
                    key={t} 
                    className="px-2.5 py-1 text-[10px] font-mono rounded bg-primary/5 text-primary/80 border border-primary/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Deep-Dive Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-3xl bg-card border border-primary/20 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/30 bg-muted/20">
                <div className="flex items-center gap-3">
                  <TerminalSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-bold font-mono text-lg text-foreground">
                    {selectedProject.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-4 sm:p-6 overflow-y-auto font-mono space-y-8">
                
                {/* Description */}
                <div>
                  <h4 className="text-sm text-primary mb-2 flex items-center gap-2 uppercase tracking-widest font-semibold">
                    <FileText className="w-4 h-4" /> Overview
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Challenges & Architecture */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <h4 className="text-sm text-primary mb-3 flex items-center gap-2 font-semibold">
                      <ShieldAlert className="w-4 h-4" /> Engineering Challenges
                    </h4>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {selectedProject.challenges}
                    </p>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <h4 className="text-sm text-primary mb-3 flex items-center gap-2 font-semibold">
                      <Zap className="w-4 h-4" /> Impact & Metrics
                    </h4>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {selectedProject.metrics}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-sm text-primary mb-3 font-semibold">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className="px-3 py-1.5 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer (Links) */}
              <div className="p-4 sm:p-6 border-t border-border/30 bg-muted/20 flex flex-wrap gap-3">
                {selectedProject.github && (
                  <a 
                    href={selectedProject.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={buttonVariants({ variant: "outline", size: "sm", className: "font-mono gap-2" })}
                  >
                    <GitBranch className="w-4 h-4" /> View Source
                  </a>
                )}
                {selectedProject.live && (
                  <a 
                    href={selectedProject.live} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={buttonVariants({ size: "sm", className: "font-mono gap-2" })}
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
