"use client";

import * as React from "react";
import { Terminal, Eye } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { WaterText } from "@/components/ui/WaterText";

export function Footer() {
  const year = new Date().getFullYear();
  const [visits, setVisits] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Only increment once per browser tab/session
    const hasVisited = typeof window !== "undefined" && sessionStorage.getItem("portfolio_visited");

    if (!hasVisited) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("portfolio_visited", "true");
      }
      fetch("/api/visits", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.visits === "number") setVisits(data.visits);
        })
        .catch(() => {
          fetch("/api/visits")
            .then((r) => r.json())
            .then((d) => setVisits(d.visits))
            .catch(() => setVisits(null));
        });
    } else {
      fetch("/api/visits")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.visits === "number") setVisits(data.visits);
        })
        .catch(() => setVisits(null));
    }
  }, []);

  return (
    <footer className="mt-6 sm:mt-10 pb-4 px-4 w-full overflow-hidden flex flex-col items-center">
      {/* Top: Copyright, Visit Count & Source Code Links */}
      <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-2 sm:mb-4">
        <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
          <Terminal className="w-4 h-4 text-primary" />
          <span>&copy; {year} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground">
          {/* Small Realtime Visit Counter (Eye + Count only) */}
          <div
            title="Total visits"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-black/[0.04] dark:border-white/[0.05] bg-white/35 dark:bg-[#101620]/45 backdrop-blur-md shadow-xs text-muted-foreground"
          >
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-foreground font-semibold">
              {visits !== null ? visits.toLocaleString() : "..."}
            </span>
          </div>

          <a
            href="https://github.com/PrateekSingh2/Portfolio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors border border-black/[0.04] dark:border-white/[0.05] hover:border-primary/40 bg-white/35 dark:bg-[#101620]/45 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xs"
          >
            <GithubIcon className="w-3.5 h-3.5 text-primary" /> Source Code
          </a>
        </div>
      </div>

      {/* Bottommost: Water Interaction Name (No divider in between) */}
      <div className="w-full flex items-center justify-center">
        <WaterText />
      </div>
    </footer>
  );
}
