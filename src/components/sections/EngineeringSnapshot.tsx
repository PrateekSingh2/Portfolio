"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code2, GitBranch, Trophy, Activity, FolderKanban, Star, ChevronRight, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SnapshotMetric {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}

const solvedPieData = [
  { name: "CodeChef",     value: 1000, color: "#f97316" },
  { name: "LeetCode",     value: 236,  color: "#eab308" },
  { name: "GeeksforGeeks", value: 115,  color: "#10b981" },
  { name: "Codeforces",   value: 100,  color: "#3b82f6" },
];

export function EngineeringSnapshot() {
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  const metrics: SnapshotMetric[] = [
    { id: "solved", label: "Problems Solved", value: "1,500+", icon: <Code2 className="w-5 h-5" />, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { id: "hackathon", label: "Hackathon Winner", value: "1x", icon: <Trophy className="w-5 h-5" />, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { id: "github", label: "GitHub Contributions", value: "400+", icon: <GitBranch className="w-5 h-5" />, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { id: "contests", label: "Contests Attended", value: "30+", icon: <Activity className="w-5 h-5" />, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { id: "projects", label: "Projects Built", value: "15+", icon: <FolderKanban className="w-5 h-5" />, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { id: "rating", label: "Peak Rating", value: "1606", icon: <Star className="w-5 h-5" />, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];

  const handleCardClick = (id: string) => {
    if (id === "projects") {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setActiveModal(id);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveModal(null);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative">
      <div className="mb-10">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Engineering Snapshot
        </h2>
        <p className="text-sm text-muted-foreground font-mono">Key metrics and computational benchmarks. Tap any card for details.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Card 
              onClick={() => handleCardClick(metric.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(metric.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${metric.label}`}
              className="relative bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/40 hover:bg-card/60 hover:-translate-y-1 transition-all duration-300 group overflow-hidden h-full cursor-pointer shadow-sm hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="p-4 flex flex-col items-start justify-between h-full min-h-[110px]">
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2 rounded-lg border ${metric.color} shrink-0`}>
                    {metric.icon}
                  </div>
                  <span className="text-[9.5px] font-mono text-muted-foreground/60 group-hover:text-primary flex items-center gap-0.5 transition-colors">
                    Details <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="text-2xl font-black font-mono tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {metric.value}
                  </div>
                  <div className="text-[9.5px] text-muted-foreground font-mono uppercase tracking-widest mt-1 font-bold">
                    {metric.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Breakdown Dialog Modals */}
      <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl p-6 rounded-2xl border-t-2 border-t-primary/50">
          {activeModal === "solved" && (
            <>
              <DialogHeader className="pb-3 border-b border-border/30">
                <DialogTitle className="text-base font-mono flex items-center justify-between text-foreground font-bold">
                  <span className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-400" /> Problems Solved Breakdown
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                    1,500+ Solved
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                  Distribution of solved algorithmic problems across hubs.
                </DialogDescription>
              </DialogHeader>

              {/* Donut Pie Chart Visual */}
              <div className="relative w-full h-40 flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={solvedPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {solvedPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black font-mono text-foreground tracking-tight">1,500+</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-mono font-bold tracking-widest -mt-0.5">Total Solved</span>
                </div>
              </div>

              <div className="space-y-2.5 py-2 font-mono text-xs max-h-[50vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-orange-500/40 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-orange-400 shrink-0 shadow-sm" />
                    <div>
                      <span className="font-bold text-foreground block">CodeChef</span>
                      <span className="text-[10px] text-muted-foreground">Starters CP & DSA Mondays</span>
                    </div>
                  </div>
                  <span className="font-black text-orange-400 text-sm">1,000+</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-amber-500/40 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0 shadow-sm" />
                    <div>
                      <span className="font-bold text-foreground block">LeetCode</span>
                      <span className="text-[10px] text-muted-foreground">136 Easy • 96 Med • 4 Hard</span>
                    </div>
                  </div>
                  <span className="font-black text-amber-400 text-sm">236</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-emerald-500/40 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 shadow-sm" />
                    <div>
                      <span className="font-bold text-foreground block">GeeksforGeeks</span>
                      <span className="text-[10px] text-muted-foreground">Practice & Daily Streaks</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-400 text-sm">115</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-blue-500/40 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-blue-400 shrink-0 shadow-sm" />
                    <div>
                      <span className="font-bold text-foreground block">Codeforces</span>
                      <span className="text-[10px] text-muted-foreground">Competitive Rounds</span>
                    </div>
                  </div>
                  <span className="font-black text-blue-400 text-sm">100+</span>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("achievements")}
                className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md cursor-pointer"
              >
                <span>View Full CP Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {activeModal === "hackathon" && (
            <>
              <DialogHeader className="pb-3 border-b border-border/30">
                <DialogTitle className="text-base font-mono flex items-center justify-between text-foreground font-bold">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" /> Hackathon Champion
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    1st Place
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                  Competitive hackathon victory details.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    1x Hackathon Winner
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                    Awarded 1st place for designing, developing, and deploying a functional high-performance software application within a fast-paced 24-hour hackathon.
                  </p>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("projects")}
                className="w-full mt-2 py-2.5 px-4 bg-amber-400 text-black font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-300 transition-all shadow-md cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {activeModal === "github" && (
            <>
              <DialogHeader className="pb-3 border-b border-border/30">
                <DialogTitle className="text-base font-mono flex items-center justify-between text-foreground font-bold">
                  <span className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-emerald-400" /> GitHub Activity
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    400+ Contributions
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                  Annual open-source activity and commit log metrics.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    400+ Yearly Contributions
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                    Consistent open-source contributions, commit streaks, pull requests, and software builds over the past year.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => scrollToSection("github")}
                  className="py-2.5 px-3 bg-muted text-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-muted/80 transition-all border border-border/40 cursor-pointer"
                >
                  <span>Heatmap Section</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="https://github.com/PrateekSingh2"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-emerald-500 text-black font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  <span>@PrateekSingh2</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          )}

          {activeModal === "contests" && (
            <>
              <DialogHeader className="pb-3 border-b border-border/30">
                <DialogTitle className="text-base font-mono flex items-center justify-between text-foreground font-bold">
                  <span className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-400" /> Contest Breakdown
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                    30+ Attended
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                  Rated contest attendance breakdown.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5 py-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">CodeChef Contests</span>
                    <span className="text-[10px] text-muted-foreground">23 Starters (CP) + 2 DSA Mondays</span>
                  </div>
                  <span className="font-black text-orange-400 text-sm">25</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">LeetCode Contests</span>
                    <span className="text-[10px] text-muted-foreground">Weekly & Biweekly Rated Contests</span>
                  </div>
                  <span className="font-black text-amber-400 text-sm">5</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">Codeforces Rounds</span>
                    <span className="text-[10px] text-muted-foreground">Div. 2 & Div. 3 Contests</span>
                  </div>
                  <span className="font-black text-blue-400 text-sm">5+</span>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("achievements")}
                className="w-full mt-2 py-2.5 px-4 bg-rose-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-400 transition-all shadow-md cursor-pointer"
              >
                <span>View Rating Progression</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {activeModal === "rating" && (
            <>
              <DialogHeader className="pb-3 border-b border-border/30">
                <DialogTitle className="text-base font-mono flex items-center justify-between text-foreground font-bold">
                  <span className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-400" /> Peak Rating Breakdown
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                    1606 Peak
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                  Highest competitive ratings achieved across platforms.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5 py-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">LeetCode Rating</span>
                    <span className="text-[10px] text-muted-foreground">Knight Rank Benchmark</span>
                  </div>
                  <span className="font-black text-amber-400 text-sm">1606</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">CodeChef DSA Rating</span>
                    <span className="text-[10px] text-muted-foreground">DSA Contest Rating Peak</span>
                  </div>
                  <span className="font-black text-emerald-400 text-sm">1522</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">CodeChef Starters (CP)</span>
                    <span className="text-[10px] text-muted-foreground">CP Division Benchmark</span>
                  </div>
                  <span className="font-black text-orange-400 text-sm">1438 Peak</span>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("achievements")}
                className="w-full mt-2 py-2.5 px-4 bg-purple-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-400 transition-all shadow-md cursor-pointer"
              >
                <span>View Full CP Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
