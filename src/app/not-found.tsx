"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  BookOpen,
  FolderKanban,
  Mail,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  const [mounted, setMounted] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState<string>("");

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-8 px-4 sm:px-6 font-sans">
      <div className="max-w-xl mx-auto w-full flex flex-col items-center text-center my-auto relative">
        {/* Ambient atmospheric aura in background */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-400/20 via-indigo-500/15 to-purple-500/20 dark:from-sky-500/15 dark:via-cyan-400/10 dark:to-indigo-500/15 blur-3xl -z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Small subtle status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-xs font-mono text-muted-foreground mb-6 shadow-2xs select-none">
          <Compass className="w-3.5 h-3.5 text-sky-500 animate-[spin_8s_linear_infinite]" />
          <span>404 • Page Not Found</span>
        </div>

        {/* Elegant clean 404 centerpiece with soft gradient */}
        <div className="relative select-none my-1">
          <h1 className="text-8xl sm:text-9xl md:text-[130px] font-extrabold tracking-tight font-sans leading-none bg-gradient-to-b from-foreground via-foreground/80 to-foreground/30 bg-clip-text text-transparent drop-shadow-sm">
            404
          </h1>
        </div>

        {/* Thoughtful, Human Title & Description */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-3 mb-2 font-sans">
          Lost in Cyberspace
        </h2>
        <p className="text-sm sm:text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed mb-8 font-sans">
          The page you&apos;re searching for{" "}
          {mounted && currentPath ? (
            <code className="px-1.5 py-0.5 rounded bg-muted/80 text-primary font-mono text-xs border border-black/5 dark:border-white/5 break-all">
              {currentPath}
            </code>
          ) : (
            "here"
          )}{" "}
          doesn&apos;t exist, has been moved, or the link may be broken. Let&apos;s get you back on track.
        </p>

        {/* Clean, Tasteful Recovery Action Buttons (No Terminal) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mb-8">
          {/* Primary Action: Back to Home */}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          {/* Secondary Quick Links */}
          <div className="flex items-center justify-center gap-2 w-full sm:w-auto flex-wrap">
            <Link
              href="/blog"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-foreground text-xs sm:text-sm font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Blog</span>
            </Link>

            <Link
              href="/projects"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-foreground text-xs sm:text-sm font-medium transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Projects</span>
            </Link>

            <Link
              href="/contact"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-foreground text-xs sm:text-sm font-medium transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
