"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Star, Award, ExternalLink, Activity, Sparkles, GraduationCap } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip as RTooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

async function fetchCPData() {
  const res = await fetch("/api/cp");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0 font-mono text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground/95">{value}</span>
    </div>
  );
}

const PLATFORM_LINKS: Record<string, string> = {
  LeetCode:   "https://leetcode.com/u/prateek_singh7/",
  Codeforces: "https://codeforces.com/profile/RajawatPrateekSingh",
  CodeChef:   "https://www.codechef.com/users/nice_trail_87",
  GFG:        "https://www.geeksforgeeks.org/profile/rajawatprateeksingh",
};

export function CPDashboard() {
  const [activeTab, setActiveTab] = React.useState<"leetcode" | "codeforces" | "codechef" | "codechef-dsa">("leetcode");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data, isLoading, error } = useQuery({
    queryKey: ["cpData"],
    queryFn: fetchCPData,
    staleTime: 1000 * 60 * 10,
  });

  const tooltipStyle = React.useMemo(() => {
    return {
      contentStyle: {
        background: isDark ? "rgba(13, 13, 13, 0.95)" : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: 8,
        fontSize: 11,
        fontFamily: "monospace",
        color: isDark ? "#fff" : "#0f172a",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
      },
      labelStyle: { color: isDark ? "#a1a1aa" : "#64748b", marginBottom: 4 },
    };
  }, [isDark]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto w-full font-mono" id="achievements">
        <h2 className="text-xl font-bold mb-2 text-foreground">~/competitive-programming</h2>
        <p className="text-sm text-muted-foreground mb-8">Loading live stats…</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-48 rounded-xl bg-muted/50" />)}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto w-full" id="achievements">
        <p className="text-sm text-muted-foreground font-mono">Could not load competitive programming data.</p>
      </section>
    );
  }

  const easyCount = data.leetcode.easy || 0;
  const mediumCount = data.leetcode.medium || 0;
  const hardCount = data.leetcode.hard || 0;
  const lcTotal = easyCount + mediumCount + hardCount;

  const easyPct = lcTotal > 0 ? Math.round((easyCount / lcTotal) * 100) : 0;
  const mediumPct = lcTotal > 0 ? Math.round((mediumCount / lcTotal) * 100) : 0;
  const hardPct = lcTotal > 0 ? Math.round((hardCount / lcTotal) * 100) : 0;

  const lcPie = [
    { name: "Easy",   value: easyCount || 1,   color: "#10b981" },
    { name: "Medium", value: mediumCount || 1,  color: "#f59e0b" },
    { name: "Hard",   value: hardCount || 1,    color: "#ef4444" },
  ];
  const totalSolvedAcrossPlatforms = (lcTotal || 0) + (data.codeforces.solved || 0) + (data.gfg.problemsSolved ?? data.gfg.solved ?? 0);
  const peakRating = Math.max(
    data.leetcode.rating || 0,
    data.codeforces.rating || 0,
    data.codeforces.maxRating || 0,
    data.codechef.rating || 0,
    data.codechef.maxRating || 0,
    data.codechef.dsaRating || 0
  );
  const totalContestsAcrossPlatforms = (data.leetcode.contests || 0) + (data.codeforces.contests || 0) + (data.codechef.contests || 0);

  // Format history data to map title to name for Recharts tooltip fallback
  type HistoryItem = { title?: string; rating?: number; [key: string]: unknown };
  const lcHistory = (data.lcHistory || []).map((h: HistoryItem) => ({ ...h, name: h.title }));
  const cfHistory = (data.cfHistory || []).map((h: HistoryItem) => ({ ...h, name: h.title }));
  const ccHistory = (data.ccHistory || []).map((h: HistoryItem) => ({ ...h, name: h.title }));
  const ccDsaHistory = (data.ccDsaHistory || []).map((h: HistoryItem) => ({ ...h, name: h.title }));

  const activeHistory = activeTab === "leetcode" 
    ? lcHistory 
    : activeTab === "codeforces" 
      ? cfHistory 
      : activeTab === "codechef"
        ? ccHistory
        : ccDsaHistory;
      
  const activeColor = activeTab === "leetcode" 
    ? (isDark ? "#eab308" : "#d97706") 
    : activeTab === "codeforces" 
      ? (isDark ? "#38bdf8" : "#2563eb") 
      : activeTab === "codechef"
        ? (isDark ? "#f97316" : "#ea580c")
        : (isDark ? "#10b981" : "#059669");

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="achievements">
      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2 text-foreground">
          <Trophy className="w-5 h-5 text-primary" /> Competitive Programming
        </h2>
        <p className="text-sm text-muted-foreground font-mono">Real-time benchmarks and profiles across algorithmic hubs.</p>
      </div>

      {/* Codolio-Inspired Top Aggregate Summary Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-card/80 border border-border/80 backdrop-blur-md shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/10" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-bold">Total Solved</span>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              {totalSolvedAcrossPlatforms.toLocaleString()}+
            </div>
          </div>
          <div className="space-y-1 border-l border-border/20 pl-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-bold">Peak Rating</span>
            <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              {peakRating}
            </div>
          </div>
          <div className="space-y-1 border-l border-border/20 pl-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-bold">Contests</span>
            <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              {totalContestsAcrossPlatforms}+
            </div>
          </div>
          <div className="space-y-1 border-l border-border/20 pl-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-bold">Platforms</span>
            <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              4 Active
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
        
        {/* LeetCode Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/80 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Trophy className="w-4 h-4 text-amber-500" /> LeetCode
              </span>
              <a 
                href={PLATFORM_LINKS.LeetCode} 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted-foreground hover:text-amber-500 transition-colors p-1 rounded-md hover:bg-amber-500/10"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col justify-between flex-1">
            <div className="flex items-center gap-5 mb-4">
              <div className="relative w-24 h-24 shrink-0 drop-shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={lcPie} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={28} 
                      outerRadius={38} 
                      paddingAngle={3} 
                      dataKey="value" 
                      stroke="none"
                      cornerRadius={4}
                    >
                      {lcPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-black font-mono tracking-tight text-foreground">{lcTotal || "—"}</span>
                  <span className="text-[7.5px] text-muted-foreground uppercase font-mono font-bold tracking-widest -mt-0.5">solved</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Easy
                    </span>
                    <span className="font-semibold text-foreground">{easyCount} <span className="text-[10px] text-muted-foreground font-normal">({easyPct}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full overflow-hidden border border-emerald-500/20">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${easyPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Medium
                    </span>
                    <span className="font-semibold text-foreground">{mediumCount} <span className="text-[10px] text-muted-foreground font-normal">({mediumPct}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-amber-100 dark:bg-amber-950/40 rounded-full overflow-hidden border border-amber-500/20">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${mediumPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Hard
                    </span>
                    <span className="font-semibold text-foreground">{hardCount} <span className="text-[10px] text-muted-foreground font-normal">({hardPct}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-red-100 dark:bg-red-950/40 rounded-full overflow-hidden border border-red-500/20">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${hardPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-1 pt-3 border-t border-border/15">
              <StatRow label="Rating" value={data.leetcode.rating || "—"} />
              <StatRow label="Rank" value={data.leetcode.rating >= 1600 ? "Knight" : "Coder"} />
              <StatRow label="Contests Attended" value={data.leetcode.contests || "—"} />
              <StatRow label="Total Active Days" value={data.leetcode.activeDays ? `${data.leetcode.activeDays} days` : "—"} />
            </div>
          </CardContent>
        </Card>

        {/* Codeforces Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/80 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Codeforces
              </span>
              <a 
                href={PLATFORM_LINKS.Codeforces} 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted-foreground hover:text-blue-500 transition-colors p-1 rounded-md hover:bg-blue-500/10"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col justify-between flex-1">
            {/* Codeforces Top Box */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-muted/40 border border-border/40 shadow-inner">
              <div>
                <span className="text-[9.5px] text-muted-foreground font-mono block mb-1 uppercase tracking-wider font-bold">Current Rating</span>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">{data.codeforces.rating || "—"}</span>
                  <Badge variant="outline" className="font-mono text-[9px] px-1 py-0 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase">
                    {data.codeforces.rank || "Newbie"}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">Max: {data.codeforces.maxRating || "—"}</span>
              </div>
              <div className="border-l border-border/25 pl-3">
                <span className="text-[9.5px] text-muted-foreground font-mono block mb-1 uppercase tracking-wider font-bold">Problems Solved</span>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">{data.codeforces.solved || "—"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{data.codeforces.contests || 0} Contests</span>
              </div>
            </div>

            <div className="mt-auto space-y-1 pt-3 border-t border-border/15">
              <StatRow label="Problems Solved" value={data.codeforces.solved || "—"} />
              <StatRow label="Max Rating" value={data.codeforces.maxRating || "—"} />
              <StatRow label="Max Rank" value={data.codeforces.maxRank || "—"} />
              <StatRow label="Contests Attended" value={data.codeforces.contests || "—"} />
            </div>
          </CardContent>
        </Card>

        {/* CodeChef Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/80 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Star className="w-4 h-4 text-orange-500 dark:text-orange-400 animate-pulse" /> CodeChef
              </span>
              <a 
                href={PLATFORM_LINKS.CodeChef} 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted-foreground hover:text-orange-500 transition-colors p-1 rounded-md hover:bg-orange-500/10"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col justify-between flex-1">
            {/* Dual Ratings Display: CP / Starters & DSA */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-muted/40 border border-border/40 shadow-inner">
              <div>
                <span className="text-[9.5px] text-muted-foreground font-mono block mb-1 uppercase tracking-wider font-bold">Starters (CP)</span>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-2xl font-black font-mono text-orange-600 dark:text-orange-400">{data.codechef.rating || "—"}</span>
                  <Badge variant="outline" className="font-mono text-[9px] px-1 py-0 border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold">
                    {data.codechef.rank || "1★"}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">Max: {data.codechef.maxRating || "—"}</span>
              </div>
              <div className="border-l border-border/25 pl-3">
                <span className="text-[9.5px] text-muted-foreground font-mono block mb-1 uppercase tracking-wider font-bold">DSA Rating</span>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{data.codechef.dsaRating || "—"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">Max: {data.codechef.dsaMaxRating || "—"}</span>
              </div>
            </div>

            <div className="mt-auto space-y-1 pt-3 border-t border-border/15">
              <StatRow label="Contests Attended" value={data.codechef.contests ? `${data.codechef.contests} (${data.codechef.startersContests || 0} CP, ${data.codechef.dsaContests || 0} DSA)` : "—"} />
              <StatRow label="Global Rank" value={data.codechef.globalRank ? `#${data.codechef.globalRank}` : "—"} />
              <StatRow label="Country Rank" value={data.codechef.countryRank ? `#${data.codechef.countryRank}` : "—"} />
            </div>
          </CardContent>
        </Card>

        {/* GFG Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/80 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Award className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> GeeksForGeeks
              </span>
              <a 
                href={PLATFORM_LINKS.GFG} 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted-foreground hover:text-emerald-500 transition-colors p-1 rounded-md hover:bg-emerald-500/10"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col justify-between flex-1">
            {/* GFG Top Box */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-muted/40 border border-border/40 shadow-inner">
              <div>
                <span className="text-[9.5px] text-muted-foreground font-mono block mb-1 uppercase tracking-wider font-bold">Coding Score</span>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{data.gfg.codingScore ?? data.gfg.rating ?? "—"}</span>
                  <Badge variant="outline" className="font-mono text-[9px] px-1 py-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    Coder
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">GeeksforGeeks</span>
              </div>
              <div className="border-l border-border/25 pl-3">
                <span className="text-[9.5px] text-muted-foreground font-mono block mb-1 uppercase tracking-wider font-bold">Practice Streak</span>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{data.gfg.streak ? `${data.gfg.streak}d` : "—"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{data.gfg.problemsSolved ?? data.gfg.solved ?? 0} Solved</span>
              </div>
            </div>

            <div className="mt-auto space-y-1 pt-3 border-t border-border/15">
              <StatRow label="Problems Solved" value={data.gfg.problemsSolved ?? data.gfg.solved ?? "—"} />
              <StatRow label="Monthly Streak" value={data.gfg.streak ? `${data.gfg.streak} days` : "—"} />
              <StatRow label="Rank" value="Coder" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ratings Progression Chart Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/80 hover:border-primary/30 transition-all duration-300 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Rating Progression
            </h3>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Interactive history of rated contests across platforms.</p>
          </div>

          {/* Organized Platform Selection Tabs - Theme Optimized */}
          <div className="flex flex-wrap bg-muted/50 p-1.5 rounded-xl border border-border/50 w-full sm:w-fit gap-1 shadow-inner backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("leetcode")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                activeTab === "leetcode" 
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-sm border border-amber-500/40" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              LeetCode
            </button>
            <button
              onClick={() => setActiveTab("codeforces")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                activeTab === "codeforces" 
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold shadow-sm border border-blue-500/40" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              Codeforces
            </button>
            <button
              onClick={() => setActiveTab("codechef")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                activeTab === "codechef" 
                  ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold shadow-sm border border-orange-500/40" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
              CodeChef (CP)
            </button>
            <button
              onClick={() => setActiveTab("codechef-dsa")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                activeTab === "codechef-dsa" 
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm border border-emerald-500/40" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              CodeChef (DSA)
            </button>
          </div>
        </div>

        <div className="h-64 w-full relative pt-2">
          <div className="absolute top-0 left-0 text-[10px] text-muted-foreground/80 font-mono uppercase tracking-wider font-semibold">
            Rating ↑
          </div>
          {activeHistory.length >= 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeHistory} margin={{ top: 15, right: 10, bottom: 5, left: -10 }}>
                <defs>
                  <linearGradient id="colorRatingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeColor} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={activeColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} vertical={false} />
                <XAxis 
                  dataKey="title" 
                  hide={true}
                />
                <YAxis 
                  stroke={isDark ? "#a1a1aa" : "#64748b"} 
                  fontSize={11} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  domain={["auto", "auto"]}
                  tick={{ fill: isDark ? "#a1a1aa" : "#64748b", fontSize: 11, fontFamily: "monospace" }}
                  width={45}
                />
                <RTooltip {...tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke={activeColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRatingGrad)"
                  dot={{ r: 3, fill: activeColor, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: activeColor, strokeWidth: 2, fill: isDark ? "#111" : "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border/40 rounded-lg">
              <span className="text-xs text-muted-foreground font-mono">Insufficient contest history to plot progression.</span>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
