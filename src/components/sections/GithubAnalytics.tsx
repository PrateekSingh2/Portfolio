"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { GitBranch, Star, Code2, ExternalLink, Users, GitPullRequest, GitCommit, AlertCircle } from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";

async function fetchGithubData() {
  const res = await fetch("/api/github");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export function GithubAnalytics() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["githubData", "v2"],
    queryFn: fetchGithubData,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <section className="py-12 px-4 max-w-3xl mx-auto w-full" id="github">
        <h2 className="text-lg font-bold font-mono mb-1">~/github</h2>
        <p className="text-sm text-muted-foreground font-mono mb-6">Loading…</p>
        <div className="space-y-4">
          <Skeleton className="h-44 rounded-lg w-full" />
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-12 px-4 max-w-3xl mx-auto w-full" id="github">
        <p className="text-muted-foreground text-sm font-mono">Could not load GitHub data.</p>
      </section>
    );
  }

  const stats = data.stats || {};
  const langs: any[] = data.languages || [];
  const latestCommits: any[] = data.latestCommits || [];
  const calendarData = data.calendarData || [];

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto w-full" id="github">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono mb-1">Github</h2>
          <p className="text-sm text-muted-foreground font-mono">Contributions, activity stream, and language analytics.</p>
        </div>
        <a
          href="https://github.com/PrateekSingh2"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline", className: "gap-2 font-mono text-xs shrink-0" })}
        >
          <GitBranch className="w-3.5 h-3.5" />
          @PrateekSingh2
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Contributions", value: stats.totalContributions || 0, icon: <GitBranch className="w-3.5 h-3.5 text-blue-400" />, show: true },
          { label: "Followers",     value: stats.followers || 0,          icon: <Users className="w-3.5 h-3.5 text-orange-400" />, show: true },
          { label: "Stars",         value: stats.starsEarned || 0,        icon: <Star className="w-3.5 h-3.5 text-yellow-400" />, show: (stats.starsEarned || 0) > 0 },
          { label: "Pull Requests", value: stats.pullRequests || 0,       icon: <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />, show: (stats.pullRequests || 0) > 0 },
        ].filter(item => item.show).map(({ label, value, icon }) => (
          <div key={label} className="bg-card border border-border/50 rounded-lg p-4 flex flex-col gap-1">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-mono">{icon} {label}</div>
            <div className="text-2xl font-bold font-mono">{value}</div>
          </div>
        ))}
      </div>

      {calendarData.length > 0 && (
        <Card className="bg-card border-border/50 mb-6 overflow-hidden">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-mono flex items-center gap-1.5 text-muted-foreground">
              <GitBranch className="w-3.5 h-3.5" /> Contribution Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 overflow-x-auto">
            <div className="min-w-[700px] pt-2">
              <ActivityCalendar
                data={calendarData}
                theme={{
                  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                }}
                colorScheme={mounted ? (theme === "dark" ? "dark" : "light") : "dark"}
                blockSize={11}
                blockMargin={3}
                showWeekdayLabels={false}
                labels={{
                  totalCount: `{{count}} contributions in the last year`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Languages Breakdown */}
        {langs.length > 0 && (
          <Card className="bg-card border-border/50 h-full">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-mono flex items-center gap-1.5 text-muted-foreground">
                <Code2 className="w-3.5 h-3.5" /> Top Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {langs.map((lang: any) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>{lang.name}</span>
                    <span className="text-muted-foreground">{lang.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${lang.percent}%`, backgroundColor: lang.color }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Latest Commits Activity Feed */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-mono flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-primary" /> Latest Commit Activity
              </span>
              <span className="text-[10px] text-muted-foreground">Live Feed</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {latestCommits.length > 0 ? (
              <div className="space-y-3">
                {latestCommits.map((c: any, i: number) => (
                  <div key={i} className="text-xs font-mono border-b border-border/20 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <a 
                        href={c.repoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="font-semibold text-primary hover:underline truncate max-w-[180px]"
                      >
                        {c.repo}
                      </a>
                      <a 
                        href={c.commitUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0 bg-muted/40 px-1.5 py-0.5 rounded"
                      >
                        <code>{c.id}</code>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <p className="text-muted-foreground line-clamp-1 mb-1 leading-snug">{c.message}</p>
                    <span className="text-[10px] text-muted-foreground/60">{c.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-mono py-4 text-center">No recent commit activity found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
