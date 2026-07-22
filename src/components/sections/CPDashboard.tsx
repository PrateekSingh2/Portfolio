"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Star, Award, ExternalLink, Activity, Sparkles, GraduationCap } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis,
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

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(13, 13, 13, 0.9)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    fontSize: 11,
    fontFamily: "monospace",
    color: "#fff",
  },
  labelStyle: { color: "#888", marginBottom: 4 },
};

const PLATFORM_LINKS: Record<string, string> = {
  LeetCode:   "https://leetcode.com/u/prateek_singh7/",
  Codeforces: "https://codeforces.com/profile/RajawatPrateekSingh",
  CodeChef:   "https://www.codechef.com/users/nice_trail_87",
  GFG:        "https://www.geeksforgeeks.org/profile/rajawatprateeksingh",
};

export function CPDashboard() {
  const [activeTab, setActiveTab] = React.useState<"leetcode" | "codeforces" | "codechef">("leetcode");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cpData"],
    queryFn: fetchCPData,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto w-full font-mono" id="achievements">
        <h2 className="text-xl font-bold mb-2">~/competitive-programming</h2>
        <p className="text-sm text-muted-foreground mb-8">Loading live stats…</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
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

  const lcPie = [
    { name: "Easy",   value: data.leetcode.easy || 0,   color: "#10b981" },
    { name: "Medium", value: data.leetcode.medium || 0,  color: "#f59e0b" },
    { name: "Hard",   value: data.leetcode.hard || 0,    color: "#ef4444" },
  ];
  const lcTotal = (data.leetcode.easy || 0) + (data.leetcode.medium || 0) + (data.leetcode.hard || 0);
  
  // Format history data to map title to name for Recharts tooltip fallback if any
  const lcHistory = (data.lcHistory || []).map((h: any) => ({ ...h, name: h.title }));
  const cfHistory = (data.cfHistory || []).map((h: any) => ({ ...h, name: h.title }));
  const ccHistory = (data.ccHistory || []).map((h: any) => ({ ...h, name: h.title }));

  const activeHistory = activeTab === "leetcode" 
    ? lcHistory 
    : activeTab === "codeforces" 
      ? cfHistory 
      : ccHistory;
      
  const activeColor = activeTab === "leetcode" 
    ? "#eab308" 
    : activeTab === "codeforces" 
      ? "#3b82f6" 
      : "#f97316";

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="achievements">
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" /> Competitive Programming
        </h2>
        <p className="text-sm text-muted-foreground font-mono">Real-time benchmarks and profiles across algorithmic hubs.</p>
      </div>

      {/* Grid Layout of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* LeetCode Card */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/40 hover:border-yellow-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Trophy className="w-4 h-4 text-yellow-500" /> LeetCode
              </span>
              <a href={PLATFORM_LINKS.LeetCode} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-center gap-6 mb-4">
              <div className="relative w-20 h-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={lcPie} cx="50%" cy="50%" innerRadius={22} outerRadius={30} paddingAngle={2} dataKey="value" stroke="none">
                      {lcPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold font-mono">{lcTotal || "—"}</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">solved</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-semibold">Easy</span>
                  <span>{data.leetcode.easy}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-amber-400 font-semibold">Medium</span>
                  <span>{data.leetcode.medium}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-red-400 font-semibold">Hard</span>
                  <span>{data.leetcode.hard}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-border/10">
              <StatRow label="Rating" value={data.leetcode.rating || "—"} />
              <StatRow label="Rank" value={data.leetcode.rating >= 1600 ? "Knight" : "Coder"} />
              <StatRow label="Contests Attended" value={data.leetcode.contests || "—"} />
            </div>
          </CardContent>
        </Card>

        {/* Codeforces Card */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/40 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Codeforces
              </span>
              <a href={PLATFORM_LINKS.Codeforces} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-extrabold font-mono text-blue-400">{data.codeforces.rating || "—"}</span>
              <Badge variant="outline" className="font-mono text-[10px] uppercase border-blue-500/20 bg-blue-500/5 text-blue-400">
                {data.codeforces.rank || "Newbie"}
              </Badge>
            </div>
            <div className="space-y-1 pt-2 border-t border-border/10">
              <StatRow label="Problems Solved" value={data.codeforces.solved || "—"} />
              <StatRow label="Max Rating" value={data.codeforces.maxRating || "—"} />
              <StatRow label="Max Rank" value={data.codeforces.maxRank || "—"} />
              <StatRow label="Contests Attended" value={data.codeforces.contests || "—"} />
            </div>
          </CardContent>
        </Card>

        {/* CodeChef Card */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/40 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Star className="w-4 h-4 text-orange-400 animate-pulse" /> CodeChef
              </span>
              <a href={PLATFORM_LINKS.CodeChef} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-orange-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-extrabold font-mono text-orange-400">{data.codechef.rating || "—"}</span>
              <Badge variant="outline" className="font-mono text-[10px] border-orange-500/20 bg-orange-500/5 text-orange-400">
                {data.codechef.rank || "1★"}
              </Badge>
            </div>
            <div className="space-y-1 pt-2 border-t border-border/10">
              <StatRow label="Highest Rating" value={data.codechef.maxRating || "—"} />
              <StatRow label="Global Rank" value={data.codechef.globalRank ? `#${data.codechef.globalRank}` : "—"} />
              <StatRow label="Country Rank" value={data.codechef.countryRank ? `#${data.codechef.countryRank}` : "—"} />
            </div>
          </CardContent>
        </Card>

        {/* GFG Card */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/40 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Award className="w-4 h-4 text-emerald-400" /> GeeksForGeeks
              </span>
              <a href={PLATFORM_LINKS.GFG} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-extrabold font-mono text-emerald-400">{data.gfg.codingScore || "—"}</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Coding Score</span>
            </div>
            <div className="space-y-1 pt-2 border-t border-border/10">
              <StatRow label="Problems Solved" value={data.gfg.problemsSolved || "—"} />
              <StatRow label="Monthly Streak" value={data.gfg.streak ? `${data.gfg.streak} days` : "—"} />
              <StatRow label="Rank" value="Coder" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ratings Progression Chart Card */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/40 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Rating Progression
            </h3>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Interactive history of rated contests.</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-muted/40 p-1 rounded-lg border border-border/20 w-fit">
            <button
              onClick={() => setActiveTab("leetcode")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                activeTab === "leetcode" 
                  ? "bg-background text-yellow-500 font-semibold shadow-sm border border-border/30" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              LeetCode
            </button>
            <button
              onClick={() => setActiveTab("codeforces")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                activeTab === "codeforces" 
                  ? "bg-background text-blue-400 font-semibold shadow-sm border border-border/30" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Codeforces
            </button>
            <button
              onClick={() => setActiveTab("codechef")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                activeTab === "codechef" 
                  ? "bg-background text-orange-400 font-semibold shadow-sm border border-border/30" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CodeChef
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          {activeHistory.length >= 2 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeHistory} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="title" 
                  stroke="#444" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#444" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={["auto", "auto"]}
                />
                <RTooltip {...TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke={activeColor}
                  strokeWidth={2}
                  dot={{ r: 3, fill: activeColor, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
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
