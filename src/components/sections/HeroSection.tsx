"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Mail, Check, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";
import { HeroBlueprint } from "@/components/ui/HeroBlueprint";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function HeroSection() {
  const [copied, setCopied] = React.useState(false);
  const [greeting, setGreeting] = React.useState("Good day");

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("prateeksinghrajawat2006@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const titles = [
    "Competitive Programmer",
    "Problem Solver",
    "AI Engineer",
    "Systems Builder",
  ];

  return (
    <section
      id="hero"
      className="max-w-3xl mx-auto w-full px-4 pt-10 sm:pt-14 pb-12 relative min-h-[50vh] flex flex-col justify-center"
    >
      {/* Subtle dot grid background (dark mode only) */}
      <div className="absolute inset-0 -z-10 w-full dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-10 pointer-events-none hidden dark:block" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Very Top: Interactive 3D Isometric Architectural Blueprint */}
        <HeroBlueprint />

        {/* Top Header: Circle Photo Frame on Left, Name, Headline & Typewriter Shifted Right */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 md:gap-7 mb-6">
          {/* Circular Photo Frame on Left */}
          <div className="relative group shrink-0">
            {/* Ambient soft glow ring matching background tones */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-amber-400/25 via-pink-400/25 to-purple-400/25 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Circular Frame */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-card/70 backdrop-blur-md border-2 border-border/60 shadow-xl group-hover:scale-105 group-hover:border-primary/50 transition-all duration-300 overflow-hidden">
              <img
                src="/images/profile.png"
                alt="Prateek Singh"
                className="w-full h-full object-cover object-center rounded-full select-none"
              />
            </div>
          </div>

          {/* Name & Typewriter Shifted Right to Image */}
          <div className="flex-1">
            {/* Greeting & Name */}
            <div className="mb-1.5 sm:mb-2">
              <p className="text-sm md:text-base font-mono font-medium text-muted-foreground mb-1">
                Hi, I&apos;m
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Prateek Singh
              </h1>
            </div>

            {/* Typewriter subtitle */}
            <div className="text-base md:text-lg text-primary font-mono h-7">
              <TypewriterEffect words={titles} />
            </div>
          </div>
        </div>

        {/* Dynamic System Time Greeting in Stylish Handwritten Font (Screenshot 2) */}
        <div className="mt-6 mb-3">
          <h2
            suppressHydrationWarning
            className="font-signature font-[family-name:var(--font-caveat)] text-3xl sm:text-4xl font-bold text-foreground tracking-wide select-none"
          >
            {greeting}
          </h2>
        </div>

        {/* About Myself: Structured Highlights matching Screenshot 2 */}
        <ul className="space-y-3 mb-8 max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0 mt-2.5" />
            <span>
              I’m <strong className="text-foreground font-semibold">Prateek Singh</strong> - an <span className="italic underline">AI Engineer</span> &amp; <span className="italic underline">System Engineer</span> specializing in high-performance backends, low-level architecture design, and distributed scalability.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0 mt-2.5" />
            <span>
              Passionate about exploring <span className="italic underline">Cloud</span> &amp; <span className="italic underline">System Design</span> challenges, turning ideas into reality through resilient, thoughtfully crafted software with low-latency architectures.
            </span>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="https://drive.google.com/file/d/1agSy6MjDGamW8K1qbfSUb80sTH_OMreM/view"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "default",
              className:
                "group/btn relative h-10 px-4.5 gap-2 font-mono text-sm font-bold rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer inline-flex items-center overflow-hidden",
            })}
          >
            <FileText className="w-4.5 h-4.5 shrink-0" />
            <span>Resume</span>
            <span className="inline-flex items-center justify-center w-0 opacity-0 -translate-x-2 group-hover/btn:w-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300 ease-out overflow-hidden">
              <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </span>
          </a>

          {/* Copy Email Button with Micro-Tooltip */}
          <div className="relative group">
            <button
              onClick={handleCopyEmail}
              aria-label="Copy Email"
              className={cn(
                "p-2.5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer rounded-xl bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/10 dark:border-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-none",
                copied && "text-emerald-500 hover:text-emerald-500 scale-105 border-emerald-500/40 bg-emerald-500/10",
              )}
            >
              {copied ? (
                <Check className="w-4.5 h-4.5 text-emerald-500 animate-in zoom-in-50 duration-200" />
              ) : (
                <Mail className="w-4.5 h-4.5" />
              )}
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out transform translate-y-1 group-hover:translate-y-0 z-30 drop-shadow-md">
              <div className="px-2 py-0.5 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 text-white text-[10px] font-mono font-medium whitespace-nowrap border border-white/10 shadow-lg">
                {copied ? "Copied to clipboard!" : "Copy email"}
              </div>
            </div>
          </div>

          {/* GitHub Button with Micro-Tooltip */}
          <div className="relative group">
            <a
              href="https://github.com/PrateekSingh2"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="p-2.5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer rounded-xl bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/10 dark:border-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-none"
            >
              <GithubIcon className="w-4.5 h-4.5" />
            </a>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out transform translate-y-1 group-hover:translate-y-0 z-30 drop-shadow-md">
              <div className="px-2 py-0.5 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 text-white text-[10px] font-mono font-medium whitespace-nowrap border border-white/10 shadow-lg">
                GitHub Profile
              </div>
            </div>
          </div>

          {/* LinkedIn Button with Micro-Tooltip */}
          <div className="relative group">
            <a
              href="https://www.linkedin.com/in/rajawatprateeksingh/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer rounded-xl bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/10 dark:border-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-none"
            >
              <LinkedinIcon className="w-4.5 h-4.5" />
            </a>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out transform translate-y-1 group-hover:translate-y-0 z-30 drop-shadow-md">
              <div className="px-2 py-0.5 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 text-white text-[10px] font-mono font-medium whitespace-nowrap border border-white/10 shadow-lg">
                LinkedIn Profile
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
