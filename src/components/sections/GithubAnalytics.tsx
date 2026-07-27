"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  Star,
  Code2,
  ExternalLink,
  Users,
  GitPullRequest,
  GitCommit,
  AlertCircle,
  ChevronRight,
  Layers,
} from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface GithubLanguage {
  name: string;
  percent: number;
  color: string;
}

interface GithubCommit {
  repo: string;
  repoUrl: string;
  commitUrl: string;
  id: string;
  message: string;
  date: string;
}

async function fetchGithubData() {
  const res = await fetch("/api/github");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export function GithubAnalytics() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["githubData", "v2"],
    queryFn: fetchGithubData,
    staleTime: 1000 * 60 * 5,
  });

  const calendarData = data?.calendarData || [];
  const calendarLength = calendarData.length;

  // Auto scroll to the rightmost edge (current month) on load
  React.useEffect(() => {
    if (calendarLength > 0 && scrollRef.current) {
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [calendarLength]);

  if (isLoading) {
    return (
      <section className="py-12 px-4 max-w-3xl mx-auto w-full" id="github">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <GithubIcon className="w-5 h-5 text-primary" /> Github
        </h2>
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
        <p className="text-muted-foreground text-sm font-mono">
          Could not load GitHub data.
        </p>
      </section>
    );
  }

  const stats = data.stats || {};
  const langs: GithubLanguage[] = data.languages || [];
  const latestCommits: GithubCommit[] = data.latestCommits || [];
  const frontCommits = latestCommits.slice(0, 3);
  const top10Commits = latestCommits.slice(0, 10);

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto w-full" id="github">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
            <GithubIcon className="w-5 h-5 text-primary" /> Github
          </h2>
          <p className="text-sm text-muted-foreground font-mono">
            Contributions, activity stream, and language analytics.
          </p>
        </div>
        <a
          href="https://github.com/PrateekSingh2"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "outline",
            className: "gap-2 font-mono text-xs shrink-0",
          })}
        >
          <GithubIcon className="w-3.5 h-3.5" />
          @PrateekSingh2
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Contributions",
            value: stats.totalContributions || 0,
            icon: <GithubIcon className="w-3.5 h-3.5 text-blue-400" />,
            show: true,
          },
          {
            label: "Followers",
            value: stats.followers || 0,
            icon: <Users className="w-3.5 h-3.5 text-orange-400" />,
            show: true,
          },
          {
            label: "Stars",
            value: stats.starsEarned || 0,
            icon: <Star className="w-3.5 h-3.5 text-yellow-400" />,
            show: (stats.starsEarned || 0) > 0,
          },
          {
            label: "Pull Requests",
            value: stats.pullRequests || 0,
            icon: <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />,
            show: (stats.pullRequests || 0) > 0,
          },
        ]
          .filter((item) => item.show)
          .map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-card border border-border/50 rounded-lg p-4 flex flex-col gap-1"
            >
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-mono">
                {icon} {label}
              </div>
              <div className="text-2xl font-bold font-mono">{value}</div>
            </div>
          ))}
      </div>

      {calendarData.length > 0 && (
        <Card className="bg-card border-border/50 mb-6 overflow-hidden">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-mono flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-primary" /> Contribution
                Heatmap
              </span>
              <span className="text-[10px] text-muted-foreground/70 font-mono">
                Last 365 days
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-none pt-2 flex justify-start sm:justify-center w-full"
            >
              <div className="shrink-0 p-1">
                <ActivityCalendar
                  data={calendarData}
                  theme={{
                    light: [
                      "#ebedf0",
                      "#9be9a8",
                      "#40c463",
                      "#30a14e",
                      "#216e39",
                    ],
                    dark: [
                      "#161b22",
                      "#0e4429",
                      "#006d32",
                      "#26a641",
                      "#39d353",
                    ],
                  }}
                  colorScheme={
                    mounted ? (theme === "dark" ? "dark" : "light") : "dark"
                  }
                  blockSize={11}
                  blockMargin={3}
                  showWeekdayLabels={false}
                  labels={{
                    totalCount: `{{count}} contributions in the last year`,
                  }}
                />
              </div>
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
              {langs.map((lang: GithubLanguage) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>{lang.name}</span>
                    <span className="text-muted-foreground">
                      {lang.percent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${lang.percent}%`,
                        backgroundColor: lang.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Latest Commits Activity Feed Card */}
        <Card
          className="bg-card border-border/50 transition-all duration-300 hover:border-primary/40 group cursor-pointer flex flex-col justify-between"
          onClick={() => setIsDialogOpen(true)}
        >
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-mono flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <GitCommit className="w-3.5 h-3.5 text-primary" /> Latest Commit
                Activity
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded font-mono group-hover:text-primary transition-colors">
                Tap to View Top 10
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 flex flex-col justify-between flex-1">
            {frontCommits.length > 0 ? (
              <div className="space-y-3">
                {frontCommits.map((c: GithubCommit, i: number) => (
                  <div
                    key={i}
                    className="text-xs font-mono border-b border-border/20 pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <a
                        href={c.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-primary hover:underline truncate max-w-[180px]"
                      >
                        {c.repo}
                      </a>
                      <a
                        href={c.commitUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0 bg-muted/40 px-1.5 py-0.5 rounded"
                      >
                        <code>{c.id}</code>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <p className="text-muted-foreground line-clamp-1 mb-1 leading-snug">
                      {c.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60">
                      {c.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-mono py-4 text-center">
                No recent commit activity found.
              </p>
            )}

            {latestCommits.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
                className="w-full mt-3 pt-2 text-center text-xs font-mono text-primary hover:text-primary/80 flex items-center justify-center gap-1.5 border-t border-border/30 group-hover:bg-primary/5 rounded-b py-1.5 transition-all font-semibold"
              >
                <span>Expand Top 10 Commits Log</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* External Dialog Modal for Top 10 Commits */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-lg md:max-w-2xl lg:max-w-3xl bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl p-5 md:p-7 rounded-2xl border-t-2 border-t-primary/60 transition-all duration-300">
          <DialogHeader className="pb-3 border-b border-border/30">
            <DialogTitle className="text-sm md:text-base font-mono flex items-center justify-between">
              <span className="flex items-center gap-2 text-foreground font-bold text-base">
                <GitCommit className="w-4 h-4 text-primary animate-pulse" />{" "}
                Commit Activity Feed
              </span>
              <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                Top 10 Commits
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
              Live GitHub repository commit stream and code pushes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1 pt-3 scrollbar-thin">
            {top10Commits.map((c: GithubCommit, i: number) => (
              <div
                key={i}
                className="text-xs font-mono p-3.5 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/40 hover:bg-muted/30 transition-all space-y-2 group/commit flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={c.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary hover:underline truncate max-w-[160px] sm:max-w-[200px] flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    <GithubIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover/commit:text-primary transition-colors" />
                    {c.repo}
                  </a>
                  <a
                    href={c.commitUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0 bg-muted/60 hover:bg-primary/20 hover:border-primary/40 border border-border/40 px-2 py-0.5 rounded-md font-mono transition-colors cursor-pointer"
                  >
                    <code>{c.id}</code>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-foreground/90 font-medium line-clamp-2 leading-relaxed text-[11px] font-sans">
                  {c.message}
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 pt-1.5 border-t border-border/15">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />{" "}
                    {c.date}
                  </span>
                  <span className="font-bold text-muted-foreground/80 font-mono">
                    Commit #{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
