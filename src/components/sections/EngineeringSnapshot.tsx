"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Trophy,
  Activity,
  FolderKanban,
  Star,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
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
  glowColor: string;
  accentBorder: string;
  badgeText: string;
}

const solvedPieData = [
  { name: "CodeChef", value: 1000, color: "#f97316" },
  { name: "LeetCode", value: 236, color: "#eab308" },
  { name: "GeeksforGeeks", value: 115, color: "#10b981" },
  { name: "Codeforces", value: 100, color: "#3b82f6" },
];

export function EngineeringSnapshot() {
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  const metrics: SnapshotMetric[] = [
    {
      id: "solved",
      label: "Problems Solved",
      value: "1,500+",
      icon: <Code2 className="w-4 h-4" />,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/25",
      glowColor: "from-blue-500/15 via-blue-500/5 to-transparent",
      accentBorder: "hover:border-blue-500/40",
      badgeText: "4 Hubs",
    },
    {
      id: "hackathon",
      label: "Hackathon Winner",
      value: "1x",
      icon: <Trophy className="w-4 h-4" />,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/25",
      glowColor: "from-amber-500/15 via-amber-500/5 to-transparent",
      accentBorder: "hover:border-amber-500/40",
      badgeText: "1st Place",
    },
    {
      id: "github",
      label: "GitHub Commits",
      value: "400+",
      icon: <GithubIcon className="w-4 h-4" />,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      glowColor: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      accentBorder: "hover:border-emerald-500/40",
      badgeText: "Yearly Streak",
    },
    {
      id: "contests",
      label: "Contests Attended",
      value: "40+",
      icon: <Activity className="w-4 h-4" />,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/25",
      glowColor: "from-rose-500/15 via-rose-500/5 to-transparent",
      accentBorder: "hover:border-rose-500/40",
      badgeText: "40+ Contests",
    },
    {
      id: "projects",
      label: "Projects Built",
      value: "4",
      icon: <FolderKanban className="w-4 h-4" />,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
      glowColor: "from-cyan-500/15 via-cyan-500/5 to-transparent",
      accentBorder: "hover:border-cyan-500/40",
      badgeText: "Full-Stack",
    },
    {
      id: "rating",
      label: "Peak Rating",
      value: "1606",
      icon: <Star className="w-4 h-4" />,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/25",
      glowColor: "from-purple-500/15 via-purple-500/5 to-transparent",
      accentBorder: "hover:border-purple-500/40",
      badgeText: "LeetCode Peak",
    },
  ];

  const handleCardClick = (id: string) => {
    if (id === "projects") {
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      setActiveModal(id);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveModal(null);
    setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-primary" /> Engineering Snapshot
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            Key metrics and computational benchmarks. Tap any metric for deep
            breakdown.
          </p>
        </div>
      </div>

      {/* Modern Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="h-full"
          >
            <Card
              onClick={() => handleCardClick(metric.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(metric.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${metric.label}`}
              className={`relative bg-card/60 backdrop-blur-md border border-border/60 ${metric.accentBorder} transition-all duration-300 group overflow-hidden h-full cursor-pointer shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl`}
            >
              {/* Subtle Ambient Radial Hover Glow */}
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${metric.glowColor} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              {/* Top Subtle Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-[115px]">
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`p-2 rounded-lg border ${metric.color} shrink-0 transition-transform group-hover:scale-105 duration-300`}
                  >
                    {metric.icon}
                  </div>

                  <span className="text-[9px] sm:text-[9.5px] font-mono font-bold text-muted-foreground/70 group-hover:text-primary transition-colors flex items-center gap-0.5 bg-muted/40 px-2 py-0.5 rounded-full border border-border/30">
                    {metric.badgeText}
                  </span>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{metric.value}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-1 font-extrabold truncate">
                    {metric.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Breakdown Dialog Modals */}
      <Dialog
        open={activeModal !== null}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] max-w-md md:max-w-2xl lg:max-w-3xl max-h-[85vh] sm:max-h-[88vh] bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl p-4 sm:p-6 md:p-7 rounded-2xl border-t-2 border-t-primary/60 transition-all duration-300 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {activeModal === "solved" && (
              <motion.div
                key="modal-solved"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-y-auto max-h-[calc(85vh-2.5rem)] sm:max-h-[calc(88vh-3.5rem)] pr-1 sm:pr-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20 touch-pan-y"
              >
                <DialogHeader className="pb-3 border-b border-border/30">
                  <DialogTitle className="text-base md:text-lg font-mono flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-foreground font-bold">
                    <span className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-blue-400 shrink-0" />{" "}
                      Problems Solved Breakdown
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shrink-0">
                      1,500+ Total Solved
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                    Structured distribution of solved algorithmic problems
                    across competitive coding platforms.
                  </DialogDescription>
                </DialogHeader>

                {/* Summary Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Total Solved
                    </span>
                    <span className="text-base font-black text-blue-400">
                      1,500+
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      CodeChef
                    </span>
                    <span className="text-base font-black text-orange-400">
                      1,000+
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      LeetCode
                    </span>
                    <span className="text-base font-black text-amber-400">
                      200+
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      GFG + Codeforces
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      200+
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-1 items-center">
                  {/* Left Column: Donut Pie Chart Visual */}
                  <div className="md:col-span-5 relative w-full h-44 sm:h-48 flex items-center justify-center p-3 rounded-2xl bg-muted/10 border border-border/20 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={solvedPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={44}
                          outerRadius={64}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={5}
                        >
                          {solvedPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-black font-mono text-foreground tracking-tight">
                        1,500+
                      </span>
                      <span className="text-[8.5px] text-muted-foreground uppercase font-mono font-bold tracking-widest -mt-0.5">
                        Problems
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Platform Breakdown Cards */}
                  <div className="md:col-span-7 space-y-2.5 font-mono text-xs max-h-[46vh] overflow-y-auto pr-1 scrollbar-thin">
                    {/* CodeChef Card */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-orange-500/40 transition-all space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0 shadow-sm" />
                          <span className="font-bold text-foreground">
                            CodeChef
                          </span>
                        </div>
                        <span className="font-black text-orange-400 text-sm">
                          1,000+
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full w-[66.7%]" />
                      </div>
                      <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>Starters Contests & DSA Mondays</span>
                        <span className="font-bold">66.7% share</span>
                      </div>
                    </div>

                    {/* LeetCode Card */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-amber-500/40 transition-all space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-sm" />
                          <span className="font-bold text-foreground">
                            LeetCode
                          </span>
                        </div>
                        <span className="font-black text-amber-400 text-sm">
                          200+
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full w-[15.7%]" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-bold">
                            136 Easy
                          </span>
                          <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20 font-bold">
                            96 Med
                          </span>
                          <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.2 rounded border border-rose-500/20 font-bold">
                            4 Hard
                          </span>
                        </div>
                        <span className="font-bold">15.7% share</span>
                      </div>
                    </div>

                    {/* GeeksforGeeks Card */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-emerald-500/40 transition-all space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm" />
                          <span className="font-bold text-foreground">
                            GeeksforGeeks
                          </span>
                        </div>
                        <span className="font-black text-emerald-400 text-sm">
                          100+
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full w-[7.6%]" />
                      </div>
                      <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>DSA Practice & POTD Streaks</span>
                        <span className="font-bold">7.6% share</span>
                      </div>
                    </div>

                    {/* Codeforces Card */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-blue-500/40 transition-all space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0 shadow-sm" />
                          <span className="font-bold text-foreground">
                            Codeforces
                          </span>
                        </div>
                        <span className="font-black text-blue-400 text-sm">
                          100+
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full w-[6.7%]" />
                      </div>
                      <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>Div. 2 & Div. 3 Contest Rounds</span>
                        <span className="font-bold">6.7% share</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Topic Badges */}
                <div className="pt-2 border-t border-border/30">
                  <div className="text-[10.5px] font-mono text-muted-foreground mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary shrink-0" /> Key
                    Algorithms & Data Structure Domains
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      Dynamic Programming
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      Graph Optimization
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      Trees & Binary Search
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      Segment Trees
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      Bit Manipulation
                    </span>
                  </div>
                </div>

                {/* Mobile Friendly Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-1 border-t border-border/20">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 px-4 bg-muted/60 text-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-muted transition-all border border-border/40 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Snapshot</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      scrollToSection("achievements");
                    }}
                    className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md cursor-pointer"
                  >
                    <span>View Full CP Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeModal === "hackathon" && (
              <motion.div
                key="modal-hackathon"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-y-auto max-h-[calc(85vh-2.5rem)] sm:max-h-[calc(88vh-3.5rem)] pr-1 sm:pr-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20 touch-pan-y"
              >
                <DialogHeader className="pb-3 border-b border-border/30">
                  <DialogTitle className="text-base md:text-lg font-mono flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-foreground font-bold">
                    <span className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400 shrink-0" />{" "}
                      Hackathon Champion
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full shrink-0">
                      1st Place Winner
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                    Competitive hackathon victory details, system metrics, and
                    technical architecture.
                  </DialogDescription>
                </DialogHeader>

                {/* Summary Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                    <span className="text-[10px] text-amber-400/80 block font-bold uppercase tracking-wider">
                      Placement
                    </span>
                    <span className="text-base font-black text-amber-400">
                      1st Place
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Build Time
                    </span>
                    <span className="text-base font-black text-foreground">
                      &lt; 12 Hours
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Latency
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      &lt; 100ms
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Stack
                    </span>
                    <span className="text-base font-black text-cyan-400">
                      Full-Stack
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      1x Hackathon Victory
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                      Awarded 1st place for Best Prototype Overall. This web app
                      was engineered in under 12 hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-2 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                      Key Engineering Benchmarks
                    </span>
                    <ul className="text-muted-foreground text-xs font-sans space-y-1.5 list-disc list-inside">
                      <li>Full-stack production app engineered in &lt; 12h</li>
                      <li>Sub-100ms real-time state synchronization</li>
                      <li>Deployed live demo with automated CI/CD pipeline</li>
                    </ul>
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="pt-2 border-t border-border/30">
                  <div className="text-[10.5px] font-mono text-muted-foreground mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />{" "}
                    Technologies & Architecture
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold">
                      Next.js 16
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      TypeScript
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      Node.js
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/40 text-foreground font-semibold">
                      Tailwind CSS
                    </span>
                  </div>
                </div>

                {/* Mobile Friendly Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-1 border-t border-border/20">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 px-4 bg-muted/60 text-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-muted transition-all border border-border/40 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Snapshot</span>
                  </button>
                  <button
                    onClick={() =>
                      window.open("https://code-slayers.netlify.app", "_blank")
                    }
                    className="w-full py-2.5 px-4 bg-amber-400 text-black font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-300 transition-all shadow-md cursor-pointer"
                  >
                    <span>View Live Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeModal === "github" && (
              <motion.div
                key="modal-github"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-y-auto max-h-[calc(85vh-2.5rem)] sm:max-h-[calc(88vh-3.5rem)] pr-1 sm:pr-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20 touch-pan-y"
              >
                <DialogHeader className="pb-3 border-b border-border/30">
                  <DialogTitle className="text-base md:text-lg font-mono flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-foreground font-bold">
                    <span className="flex items-center gap-2">
                      <GithubIcon className="w-5 h-5 text-emerald-400 shrink-0" />{" "}
                      GitHub Open Source Activity
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0">
                      400+ Contributions
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                    Annual open-source commit history, pull request
                    contributions, and repository management.
                  </DialogDescription>
                </DialogHeader>

                {/* Summary Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <span className="text-[10px] text-emerald-400/80 block font-bold uppercase tracking-wider">
                      Contributions
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      400+
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Cadence
                    </span>
                    <span className="text-base font-black text-foreground">
                      Daily Streaks
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Primary Language
                    </span>
                    <span className="text-base font-black text-blue-400">
                      TypeScript
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Open Source
                    </span>
                    <span className="text-base font-black text-cyan-400">
                      Active
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 flex flex-col justify-between">
                    <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      400+ Yearly Contributions
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                      Consistent open-source commit history, pull request
                      contributions, feature branches, and modular repository
                      architecture.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-2 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                      Activity Highlights
                    </span>
                    <ul className="text-muted-foreground text-xs font-sans space-y-1.5 list-disc list-inside">
                      <li>Active open-source public repositories</li>
                      <li>Daily contribution streaks & PR merges</li>
                      <li>Strict TypeScript type safety & clean commits</li>
                    </ul>
                  </div>
                </div>

                {/* Mobile Friendly Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-1 border-t border-border/20">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="py-2.5 px-3 bg-muted/60 text-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-muted transition-all border border-border/40 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      scrollToSection("github");
                    }}
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
              </motion.div>
            )}

            {activeModal === "contests" && (
              <motion.div
                key="modal-contests"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-y-auto max-h-[calc(85vh-2.5rem)] sm:max-h-[calc(88vh-3.5rem)] pr-1 sm:pr-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20 touch-pan-y"
              >
                <DialogHeader className="pb-3 border-b border-border/30">
                  <DialogTitle className="text-base md:text-lg font-mono flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-foreground font-bold">
                    <span className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-rose-400 shrink-0" />{" "}
                      Rated Contest Attendance
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full shrink-0">
                      40+ Contests Attended
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                    Attendance breakdown across competitive programming rounds
                    and timed contests.
                  </DialogDescription>
                </DialogHeader>

                {/* Summary Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25">
                    <span className="text-[10px] text-rose-400/80 block font-bold uppercase tracking-wider">
                      Total Contests
                    </span>
                    <span className="text-base font-black text-rose-400">
                      40+
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      CodeChef
                    </span>
                    <span className="text-base font-black text-orange-400">
                      25
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      LeetCode
                    </span>
                    <span className="text-base font-black text-amber-400">
                      5
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Codeforces
                    </span>
                    <span className="text-base font-black text-blue-400">
                      11
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-1 font-mono text-xs">
                  {/* CodeChef Card */}
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 hover:border-orange-500/40 transition-all space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground block">
                          CodeChef
                        </span>
                        <span className="font-black text-orange-400 text-base">
                          25
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1.5">
                        <div className="h-full bg-orange-400 rounded-full w-[61%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        23 Starters Rounds + 2 DSA Mondays
                      </span>
                    </div>
                  </div>

                  {/* LeetCode Card */}
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 hover:border-amber-500/40 transition-all space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground block">
                          LeetCode
                        </span>
                        <span className="font-black text-amber-400 text-base">
                          5
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1.5">
                        <div className="h-full bg-amber-400 rounded-full w-[12%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        Weekly & Biweekly Rated Contests
                      </span>
                    </div>
                  </div>

                  {/* Codeforces Card */}
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 hover:border-blue-500/40 transition-all space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground block">
                          Codeforces
                        </span>
                        <span className="font-black text-blue-400 text-base">
                          11
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1.5">
                        <div className="h-full bg-blue-400 rounded-full w-[27%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        Div. 2 & Div. 3 Competitive Rounds
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Friendly Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-1 border-t border-border/20">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 px-4 bg-muted/60 text-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-muted transition-all border border-border/40 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Snapshot</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      scrollToSection("achievements");
                    }}
                    className="w-full py-2.5 px-4 bg-rose-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-400 transition-all shadow-md cursor-pointer"
                  >
                    <span>View Rating Progression</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeModal === "rating" && (
              <motion.div
                key="modal-rating"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-y-auto max-h-[calc(85vh-2.5rem)] sm:max-h-[calc(88vh-3.5rem)] pr-1 sm:pr-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20 touch-pan-y"
              >
                <DialogHeader className="pb-3 border-b border-border/30">
                  <DialogTitle className="text-base md:text-lg font-mono flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-foreground font-bold">
                    <span className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-400 shrink-0" /> Peak
                      Rating Benchmarks
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full shrink-0">
                      1606 Peak Rating
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
                    Highest competitive ratings and percentile benchmarks
                    achieved across platforms.
                  </DialogDescription>
                </DialogHeader>

                {/* Summary Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25">
                    <span className="text-[10px] text-purple-400/80 block font-bold uppercase tracking-wider">
                      LeetCode Peak
                    </span>
                    <span className="text-base font-black text-purple-400">
                      1606
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      CodeChef DSA
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      1522
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      CodeChef CP
                    </span>
                    <span className="text-base font-black text-orange-400">
                      1438
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                      Percentile
                    </span>
                    <span className="text-base font-black text-amber-400">
                      Top 15%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-1 font-mono text-xs">
                  {/* LeetCode Card */}
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 hover:border-amber-500/40 transition-all space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground block">
                          LeetCode Rating
                        </span>
                        <span className="font-black text-amber-400 text-base">
                          1606
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1.5">
                        <div className="h-full bg-amber-400 rounded-full w-[80%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        Knight Rank Benchmark
                      </span>
                    </div>
                  </div>

                  {/* CodeChef DSA Card */}
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 hover:border-emerald-500/40 transition-all space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground block">
                          CodeChef DSA
                        </span>
                        <span className="font-black text-emerald-400 text-base">
                          1522
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1.5">
                        <div className="h-full bg-emerald-400 rounded-full w-[76%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        DSA Contest Peak
                      </span>
                    </div>
                  </div>

                  {/* CodeChef Starters Card */}
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 hover:border-orange-500/40 transition-all space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground block">
                          CodeChef Starters
                        </span>
                        <span className="font-black text-orange-400 text-base">
                          1438
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1.5">
                        <div className="h-full bg-orange-400 rounded-full w-[72%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        CP Division Peak
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Friendly Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-1 border-t border-border/20">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 px-4 bg-muted/60 text-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-muted transition-all border border-border/40 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Snapshot</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      scrollToSection("achievements");
                    }}
                    className="w-full py-2.5 px-4 bg-purple-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-400 transition-all shadow-md cursor-pointer"
                  >
                    <span>View Full CP Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
}
