"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code2, GitBranch, Trophy, Activity, FolderKanban, Star, ChevronRight } from "lucide-react";

interface SnapshotMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}

export function EngineeringSnapshot() {
  const metrics: SnapshotMetric[] = [
    { label: "Problems Solved", value: "1,500+", icon: <Code2 className="w-5 h-5" />, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", highlight: true },
    { label: "LeetCode Rating", value: "1500+", icon: <Trophy className="w-5 h-5" />, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { label: "Codeforces Rating", value: "1000+", icon: <Star className="w-5 h-5" />, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { label: "GitHub Contributions", value: "400+", icon: <GitBranch className="w-5 h-5" />, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Contests Attended", value: "30+", icon: <Activity className="w-5 h-5" />, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { label: "Projects Built", value: "15", icon: <FolderKanban className="w-5 h-5" />, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  ];

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative">
      <div className="mb-10">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Engineering Snapshot
        </h2>
        <p className="text-sm text-muted-foreground font-mono">Key metrics and computational benchmarks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={metric.highlight ? "sm:col-span-2 md:col-span-1" : ""}
          >
            <Card className="relative bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 group overflow-hidden h-full">
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="p-5 flex flex-col items-start justify-between h-full min-h-[140px]">
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2.5 rounded-lg border ${metric.color} shrink-0`}>
                    {metric.icon}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/70 group-hover:translate-x-1 transition-all" />
                </div>
                
                <div className="mt-4">
                  <div className="text-3xl font-extrabold font-mono tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {metric.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-1.5 font-bold">
                    {metric.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
