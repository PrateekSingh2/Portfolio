"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

async function fetchGithubData() {
  const res = await fetch(`/api/github?t=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export function GithubAnalytics() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const userInteractedRef = React.useRef(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["githubData", "v3"],
    queryFn: fetchGithubData,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const calendarData = data?.calendarData || [];

  const totalContributions = React.useMemo(() => {
    return calendarData.reduce((acc: number, curr: { count?: number }) => acc + (curr.count || 0), 0);
  }, [calendarData]);

  // On mobile view, automatically shift heatmap to the rightmost (current month)
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || calendarData.length === 0) return;

    const scrollToRightmost = () => {
      if (userInteractedRef.current) return;
      if (!scrollContainerRef.current) return;

      const innerScroll = scrollContainerRef.current.querySelector(
        ".react-activity-calendar__scroll-container"
      ) as HTMLElement | null;

      const targets = [
        innerScroll,
        scrollContainerRef.current,
        scrollContainerRef.current.querySelector("article") as HTMLElement | null,
      ].filter(Boolean) as HTMLElement[];

      for (const el of targets) {
        if (el.scrollWidth > el.clientWidth) {
          el.scrollLeft = el.scrollWidth;
        }
      }
    };

    // Immediate attempt
    scrollToRightmost();

    // Trigger across multiple frames & layout ticks to guarantee SVG measurement has applied
    const raf1 = requestAnimationFrame(scrollToRightmost);
    const raf2 = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToRightmost);
    });
    const t1 = setTimeout(scrollToRightmost, 20);
    const t2 = setTimeout(scrollToRightmost, 80);
    const t3 = setTimeout(scrollToRightmost, 200);
    const t4 = setTimeout(scrollToRightmost, 450);

    // Watch for size changes using ResizeObserver (when SVG finishes rendering or dimension changes)
    const innerScroll = container.querySelector(
      ".react-activity-calendar__scroll-container"
    );
    const targetToObserve = innerScroll || container;
    const observer = new ResizeObserver(() => {
      scrollToRightmost();
    });
    observer.observe(targetToObserve);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      observer.disconnect();
    };
  }, [calendarData, mounted]);

  // Small, elegant loading animation for slow connections or pending fetch
  if (isLoading || (!data && !error)) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 my-1">
        <div className="p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col items-center justify-center min-h-[132px] gap-3 select-none">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
            <span>Fetching contribution stats...</span>
          </div>

          {/* Shimmering contribution activity mini-grid animation */}
          <div className="flex items-center gap-1.5 opacity-60 overflow-hidden max-w-full py-1">
            {Array.from({ length: 24 }).map((_, col) => (
              <div key={col} className="flex flex-col gap-1.5 shrink-0">
                {Array.from({ length: 4 }).map((_, row) => (
                  <div
                    key={row}
                    className="w-2.5 h-2.5 rounded-[2px] bg-black/15 dark:bg-white/15 animate-pulse"
                    style={{
                      animationDelay: `${(col * 35 + row * 80) % 900}ms`,
                      animationDuration: "1.4s",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data || calendarData.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 my-1">
      <div className="p-3.5 sm:p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
        {/* Heatmap Grid: Horizontal swipeable on mobile, centered and fitted on desktop */}
        <div
          ref={scrollContainerRef}
          onTouchStart={() => {
            userInteractedRef.current = true;
          }}
          onMouseDown={() => {
            userInteractedRef.current = true;
          }}
          onWheel={() => {
            userInteractedRef.current = true;
          }}
          className="w-full overflow-x-auto scrollbar-none flex justify-start sm:justify-center items-center py-1"
        >
          <div className="min-w-fit">
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
              blockMargin={2}
              blockRadius={2}
              fontSize={11}
              showWeekdayLabels={false}
              showTotalCount={false}
              showColorLegend={false}
            />
          </div>
        </div>

        {/* Clean Responsive Footer: Count on leftmost & Less/More on rightmost with responsive spacing */}
        <div className="mt-3 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2 text-[11px] sm:text-xs font-mono text-muted-foreground w-full select-none">
          {/* Total Contributions Count - Leftmost side */}
          <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className="font-bold text-foreground">
              {totalContributions.toLocaleString()}
            </span>
            <span className="hidden sm:inline">contributions in last year</span>
            <span className="sm:hidden">contributions</span>
          </div>

          {/* Color Scale Legend - Rightmost side */}
          <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 text-muted-foreground/80">
            <span className="text-[10px] sm:text-xs">Less</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {(mounted && theme === "dark"
                ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
                : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
              ).map((color, i) => (
                <span
                  key={i}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px] border border-black/5 dark:border-white/5 inline-block shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
