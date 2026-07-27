"use client";

import { Terminal, Heart } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/20 mt-16 py-10 px-4 w-full">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
          <Terminal className="w-4 h-4 text-primary" />
          <span>&copy; {year} Prateek Singh.</span>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-mono text-muted-foreground">
          <a
            href="https://github.com/PrateekSingh2/Portfolio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors border border-border/40 hover:border-primary/20 bg-card/25 backdrop-blur-sm px-3 py-1.5 rounded-lg"
          >
            <GithubIcon className="w-3.5 h-3.5 text-primary" /> Source Code
          </a>
        </div>
      </div>
    </footer>
  );
}
