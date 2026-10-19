"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLink,
  Activity,
  Flame,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

async function fetchCPData() {
  const res = await fetch("/api/cp");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

const PLATFORM_LINKS: Record<string, string> = {
  leetcode: "https://leetcode.com/u/prateek_singh7/",
  codeforces: "https://codeforces.com/profile/RajawatPrateekSingh",
  codechef: "https://www.codechef.com/users/nice_trail_87",
  gfg: "https://www.geeksforgeeks.org/profile/rajawatprateeksingh",
};

export function CPDashboard() {
  const [selectedPlatform, setSelectedPlatform] = React.useState<
    "leetcode" | "codeforces" | "codechef" | "codechef-dsa" | "gfg"
  >("codechef");
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
        background: isDark
          ? "rgba(18, 18, 22, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
        fontSize: 12,
        fontFamily: "monospace",
        color: isDark ? "#fff" : "#0f172a",
        boxShadow: "0 10px 25px -4px rgba(0,0,0,0.18)",
        padding: "8px 12px",
      },
      labelStyle: {
        color: isDark ? "#94a3b8" : "#64748b",
        marginBottom: 3,
        fontWeight: 600,
      },
    };
  }, [isDark]);

  if (isLoading) {
    return (
      <section
        className="py-14 px-4 max-w-3xl mx-auto w-full font-sans"
        id="achievements"
      >
        <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-foreground mb-6">
          Competitive Programming
        </h2>
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-2xl bg-muted/40 w-full" />
          <Skeleton className="h-64 rounded-2xl bg-muted/40 w-full" />
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section
        className="py-14 px-4 max-w-3xl mx-auto w-full font-sans"
        id="achievements"
      >
        <p className="text-sm text-muted-foreground font-mono">
          Could not load competitive programming data.
        </p>
      </section>
    );
  }

  // Stats calculation
  const easyCount = data.leetcode?.easy || 0;
  const mediumCount = data.leetcode?.medium || 0;
  const hardCount = data.leetcode?.hard || 0;
  const lcTotal = easyCount + mediumCount + hardCount || data.leetcode?.solved || 0;

  const totalSolvedAcrossPlatforms =
    (lcTotal || 0) +
    (data.codeforces?.solved || 0) +
    (data.gfg?.problemsSolved ?? data.gfg?.solved ?? 0);

  const peakRating = Math.max(
    data.leetcode?.rating || 0,
    data.codeforces?.rating || 0,
    data.codeforces?.maxRating || 0,
    data.codechef?.rating || 0,
    data.codechef?.maxRating || 0,
    data.codechef?.dsaRating || 0
  );

  const totalContestsAcrossPlatforms =
    (data.leetcode?.contests || 0) +
    (data.codeforces?.contests || 0) +
    (data.codechef?.contests || 0);

  // History mapping for AreaChart
  type HistoryItem = {
    title?: string;
    rating?: number;
    [key: string]: unknown;
  };

  const lcHistory = (data.lcHistory || []).map((h: HistoryItem) => ({
    ...h,
    name: h.title,
  }));
  const cfHistory = (data.cfHistory || []).map((h: HistoryItem) => ({
    ...h,
    name: h.title,
  }));
  const ccHistory = (data.ccHistory || []).map((h: HistoryItem) => ({
    ...h,
    name: h.title,
  }));
  const ccDsaHistory = (data.ccDsaHistory || []).map((h: HistoryItem) => ({
    ...h,
    name: h.title,
  }));

  const activeHistory =
    selectedPlatform === "leetcode"
      ? lcHistory
      : selectedPlatform === "codeforces"
      ? cfHistory
      : selectedPlatform === "codechef"
      ? ccHistory
      : selectedPlatform === "codechef-dsa"
      ? ccDsaHistory
      : [];

  const activeColor =
    selectedPlatform === "leetcode"
      ? isDark ? "#f59e0b" : "#d97706"
      : selectedPlatform === "codeforces"
      ? isDark ? "#38bdf8" : "#2563eb"
      : selectedPlatform === "codechef"
      ? isDark ? "#f97316" : "#ea580c"
      : selectedPlatform === "codechef-dsa"
      ? isDark ? "#10b981" : "#059669"
      : isDark ? "#10b981" : "#059669";

  return (
    <section
      className="py-14 px-4 max-w-3xl mx-auto w-full relative"
      id="achievements"
    >
      {/* Header matching Experience and Education */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-foreground">
            Competitive Programming
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-1">
            Real-time algorithmic benchmarks and contest trajectories.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground self-start sm:self-auto pt-1 sm:pt-0">
          <span className="text-foreground font-bold">1,500+</span> solved
          <span>•</span>
          <span className="text-foreground font-bold">{peakRating}</span> peak
          <span>•</span>
          <span className="text-foreground font-bold">{totalContestsAcrossPlatforms}</span> contests
        </div>
      </div>

      {/* 4 Interactive Platform Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
        {/* CodeChef Selector (Swapped to 1st Position) */}
        <button
          type="button"
          onClick={() => setSelectedPlatform("codechef")}
          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
            selectedPlatform === "codechef" || selectedPlatform === "codechef-dsa"
              ? "bg-orange-500/10 border-orange-500/50 shadow-sm"
              : "bg-transparent border-black/[0.08] dark:border-white/[0.08] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>CodeChef</span>
            </div>
            <a
              href={PLATFORM_LINKS.codechef}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-orange-500 transition-colors p-0.5"
              aria-label="Open CodeChef Profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-orange-600 dark:text-orange-400">
            {data.codechef?.rating || "—"}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
            {data.codechef?.rank || "1★"} • DSA {data.codechef?.dsaRating || "—"}
          </div>
        </button>

        {/* Codeforces Selector (2nd Position) */}
        <button
          type="button"
          onClick={() => setSelectedPlatform("codeforces")}
          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
            selectedPlatform === "codeforces"
              ? "bg-sky-500/10 border-sky-500/50 shadow-sm"
              : "bg-transparent border-black/[0.08] dark:border-white/[0.08] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Codeforces</span>
            </div>
            <a
              href={PLATFORM_LINKS.codeforces}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-sky-500 transition-colors p-0.5"
              aria-label="Open Codeforces Profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-sky-600 dark:text-sky-400">
            {data.codeforces?.rating || "—"}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground truncate mt-0.5 capitalize">
            {data.codeforces?.rank || "Newbie"} • Peak {data.codeforces?.maxRating || "—"}
          </div>
        </button>

        {/* LeetCode Selector (Swapped to 3rd Position) */}
        <button
          type="button"
          onClick={() => setSelectedPlatform("leetcode")}
          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
            selectedPlatform === "leetcode"
              ? "bg-amber-500/10 border-amber-500/50 shadow-sm"
              : "bg-transparent border-black/[0.08] dark:border-white/[0.08] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>LeetCode</span>
            </div>
            <a
              href={PLATFORM_LINKS.leetcode}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-amber-500 transition-colors p-0.5"
              aria-label="Open LeetCode Profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {data.leetcode?.rating || "—"}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
            {lcTotal} solved • {data.leetcode?.rating >= 1600 ? "Knight" : "Coder"}
          </div>
        </button>

        {/* GeeksforGeeks Selector (4th Position) */}
        <button
          type="button"
          onClick={() => setSelectedPlatform("gfg")}
          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
            selectedPlatform === "gfg"
              ? "bg-emerald-500/10 border-emerald-500/50 shadow-sm"
              : "bg-transparent border-black/[0.08] dark:border-white/[0.08] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>GFG</span>
            </div>
            <a
              href={PLATFORM_LINKS.gfg}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-emerald-500 transition-colors p-0.5"
              aria-label="Open GFG Profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {data.gfg?.codingScore ?? data.gfg?.rating ?? "—"}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
            {data.gfg?.problemsSolved ?? data.gfg?.solved ?? 0} solved • {data.gfg?.streak ? `${data.gfg.streak}d 🔥` : "Active"}
          </div>
        </button>
      </div>

      {/* Ratings Progression Plot & Platform Details */}
      <div className="p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-transparent">
        {/* Chart Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-bold font-mono text-foreground capitalize">
              {selectedPlatform === "gfg"
                ? "GeeksforGeeks Overview"
                : `${selectedPlatform.replace("-", " ")} Rating Timeline`}
            </span>
          </div>

          {/* Sub-Track Switcher (for CodeChef Starters vs DSA) */}
          {(selectedPlatform === "codechef" || selectedPlatform === "codechef-dsa") && (
            <div className="inline-flex items-center p-0.5 rounded-lg border border-black/10 dark:border-white/10 bg-muted/20 text-xs font-mono self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedPlatform("codechef")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  selectedPlatform === "codechef"
                    ? "bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Starters CP
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlatform("codechef-dsa")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  selectedPlatform === "codechef-dsa"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                DSA Track
              </button>
            </div>
          )}

          {/* Direct Profile Link */}
          <a
            href={
              selectedPlatform === "codechef-dsa"
                ? PLATFORM_LINKS.codechef
                : PLATFORM_LINKS[selectedPlatform] || "#"
            }
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* The Ratings Plot */}
        {selectedPlatform !== "gfg" ? (
          <div className="h-56 sm:h-64 w-full relative pt-1">
            <div className="absolute top-0 left-0 text-[10px] text-muted-foreground/75 font-mono uppercase tracking-wider font-semibold">
              Rating ↑
            </div>
            {activeHistory.length >= 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeHistory}
                  margin={{ top: 15, right: 10, bottom: 5, left: -10 }}
                >
                  <defs>
                    <linearGradient
                      id="cpRatingGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={activeColor}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={activeColor}
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
                    }
                    vertical={false}
                  />
                  <XAxis dataKey="title" hide={true} />
                  <YAxis
                    stroke={isDark ? "#a1a1aa" : "#64748b"}
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    domain={["auto", "auto"]}
                    tick={{
                      fill: isDark ? "#a1a1aa" : "#64748b",
                      fontSize: 11,
                      fontFamily: "monospace",
                    }}
                    width={45}
                  />
                  <RTooltip {...tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke={activeColor}
                    strokeWidth={2.2}
                    fillOpacity={1}
                    fill="url(#cpRatingGradient)"
                    dot={{ r: 3, fill: activeColor, strokeWidth: 0 }}
                    activeDot={{
                      r: 5,
                      stroke: activeColor,
                      strokeWidth: 2,
                      fill: isDark ? "#111" : "#fff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-border/30 rounded-xl">
                <span className="text-xs text-muted-foreground font-mono">
                  Contest progression history synchronizing…
                </span>
              </div>
            )}
          </div>
        ) : (
          /* GFG Practice Overview */
          <div className="h-56 sm:h-64 w-full flex flex-col justify-center items-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-lg font-bold font-mono text-foreground mb-1">
              GeeksforGeeks Verified Coder
            </div>
            <p className="text-xs text-muted-foreground font-mono max-w-sm mb-4">
              Regular participant in Problem of the Day (POTD) and data structure algorithm tracks with active consistency streak.
            </p>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                {data.gfg?.problemsSolved ?? data.gfg?.solved ?? 0} Problems Solved
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                {data.gfg?.streak ? `${data.gfg.streak}d Streak` : "Active"}
              </span>
            </div>
          </div>
        )}

        {/* Selected Platform Quick Metrics Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-2 border-t border-border/20 text-xs font-mono">
          {selectedPlatform === "leetcode" && (
            <>
              <div>
                <span className="text-[10px] text-muted-foreground block">Easy Solved</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{easyCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Medium Solved</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{mediumCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Hard Solved</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{hardCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Contests</span>
                <span className="font-bold text-foreground">{data.leetcode?.contests || "—"}</span>
              </div>
            </>
          )}

          {selectedPlatform === "codeforces" && (
            <>
              <div>
                <span className="text-[10px] text-muted-foreground block">Current Rank</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 capitalize">{data.codeforces?.rank || "Newbie"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Max Rating</span>
                <span className="font-bold text-foreground">{data.codeforces?.maxRating || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Problems Solved</span>
                <span className="font-bold text-foreground">{data.codeforces?.solved || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Contests</span>
                <span className="font-bold text-foreground">{data.codeforces?.contests || 0}</span>
              </div>
            </>
          )}

          {(selectedPlatform === "codechef" || selectedPlatform === "codechef-dsa") && (
            <>
              <div>
                <span className="text-[10px] text-muted-foreground block">Global Rank</span>
                <span className="font-bold text-foreground">#{data.codechef?.globalRank || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Country Rank</span>
                <span className="font-bold text-foreground">#{data.codechef?.countryRank || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Max Rating</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{data.codechef?.maxRating || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Total Contests</span>
                <span className="font-bold text-foreground">{data.codechef?.contests || "—"}</span>
              </div>
            </>
          )}

          {selectedPlatform === "gfg" && (
            <>
              <div>
                <span className="text-[10px] text-muted-foreground block">Coding Score</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.gfg?.codingScore || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Problems Solved</span>
                <span className="font-bold text-foreground">{data.gfg?.problemsSolved || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Streak</span>
                <span className="font-bold text-foreground">{data.gfg?.streak ? `${data.gfg.streak} days` : "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Status</span>
                <span className="font-bold text-foreground">Active</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
