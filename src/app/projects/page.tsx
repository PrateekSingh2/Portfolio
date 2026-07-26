"use client";

import React, { useState, useEffect } from "react";
import { Globe, GitBranch, TerminalSquare, FileText, ShieldAlert, Zap, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { PROJECTS_DATA, Project, ProjectCategory } from "@/lib/projectsData";
import { preloadImages } from "@/lib/mediaCache";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";
import { Spotlight } from "@/components/ui/Spotlight";

function LinkedInIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "ALL", label: "ALL" },
  { id: "AI/ML/DL", label: "AI/ML/DL" },
  { id: "WebDev", label: "WebDev" },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Preload all project thumbnails into browser cache for zero latency
    preloadImages(PROJECTS_DATA.map((p) => p.thumbnail));
  }, []);

  const filteredProjects = PROJECTS_DATA.filter((project) => {
    if (activeCategory === "ALL") return true;
    return project.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col justify-between font-sans transition-colors duration-300">
      <Spotlight />

      {/* Main Content Container matching Homepage width (max-w-3xl) */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-24 relative z-10 flex-grow">

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
            All Projects
          </h1>
        </div>

        {/* Category Filter Pills */}
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-card/80 border border-border/80 mb-8 backdrop-blur-md shadow-sm">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid matching Homepage 2-Column style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="flex"
            >
              <div
                onClick={() => setSelectedProject(project)}
                className="w-full bg-card/80 backdrop-blur-md border border-border/80 hover:border-primary/40 rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group cursor-pointer relative overflow-hidden"
              >
                {/* Top ambient hover accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Thumbnail Container */}
                  <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-5 border border-border/60 bg-muted/30 relative group-hover:scale-[1.01] transition-transform duration-300">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-foreground group-hover:text-primary transition-colors mb-2.5 leading-snug">
                    {project.title}
                  </h2>

                  {/* Short Desc */}
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans mb-5 line-clamp-3">
                    {project.shortDesc}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-muted/60 text-muted-foreground border border-border/50 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 font-semibold font-mono text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>View Website</span>
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 font-semibold font-mono text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}

                  {project.linkedin && (
                    <a
                      href={project.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 font-semibold font-mono text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                      <span>Post</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Project Deep-Dive Modal Overlay */}
      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="w-[calc(100%-1.5rem)] max-w-3xl md:max-w-4xl bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl p-5 md:p-8 rounded-2xl border-t-2 border-t-primary/60 transition-all duration-300 overflow-hidden font-sans">
            <DialogHeader className="pb-3 border-b border-border/30">
              <DialogTitle className="text-base sm:text-lg md:text-xl font-mono flex items-start gap-2.5 text-foreground font-bold leading-snug">
                <TerminalSquare className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                <span className="break-words font-extrabold">{selectedProject.title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                Detailed architecture breakdown, technical challenges, and key impact.
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 font-sans space-y-5 text-xs max-h-[70vh] md:max-h-[75vh] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-border">
                <img
                  src={selectedProject.thumbnail}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-xs text-primary mb-1.5 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <FileText className="w-4 h-4" /> Project Overview
                </h4>
                <p className="text-foreground/90 leading-relaxed bg-muted/20 p-4 sm:p-5 rounded-2xl border border-border/30 break-words font-sans text-xs sm:text-sm shadow-inner">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 sm:p-5 space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <h4 className="text-xs text-primary flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" /> Engineering Challenges
                  </h4>
                  <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed break-words font-sans">
                    {selectedProject.challenges}
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 sm:p-5 space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <h4 className="text-xs text-primary flex items-center gap-1.5 font-bold">
                    <Zap className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Impact & Benchmark Metrics
                  </h4>
                  <p className="text-[11.5px] sm:text-xs text-muted-foreground leading-relaxed break-words font-sans">
                    {selectedProject.metrics}
                  </p>
                </div>
              </div>

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

            <div className="pt-3.5 border-t border-border/30 flex flex-wrap items-center justify-end gap-3 font-sans">
              {selectedProject.github && (
                <a 
                  href={selectedProject.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-secondary-foreground font-mono text-xs font-bold hover:bg-secondary/80 transition-colors"
                >
                  <GitBranch className="w-4 h-4 text-primary" /> View Source Code
                </a>
              )}
              {selectedProject.live && (
                <a 
                  href={selectedProject.live} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Globe className="w-4 h-4" /> Launch Application
                </a>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </div>
  );
}
