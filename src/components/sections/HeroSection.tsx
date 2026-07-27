"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Mail, Check } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

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
      className="max-w-3xl mx-auto w-full px-4 pt-20 pb-12 relative min-h-[50vh] flex flex-col justify-center"
      id="hero"
    >
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 -z-10 w-full bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Greeting & Name */}
        <div className="mb-3">
          <p className="text-sm md:text-base font-mono font-medium text-slate-400 mb-1">
            Hi, I&apos;m
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Prateek Singh
          </h1>
        </div>

        {/* Typewriter subtitle */}
        <div className="text-base md:text-lg text-primary font-mono mb-4 h-7">
          <TypewriterEffect words={titles} />
        </div>

        {/* Bio */}
        <p className="text-muted-foreground text-base mb-8 max-w-xl leading-relaxed">
          B.Tech AI student focused on competitive programming, low-level
          systems design, and building scalable software. Currently enhancing my
          problem-solving skills and exploring system architecture.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://drive.google.com/file/d/1agSy6MjDGamW8K1qbfSUb80sTH_OMreM/view"
            target="_blank"
            className={buttonVariants({
              variant: "default",
              className:
                "h-10 px-4.5 gap-2.5 font-mono text-sm font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform",
            })}
          >
            <FileText className="w-5 h-5" />
            Resume
          </a>

          <button
            onClick={handleCopyEmail}
            title={
              copied
                ? "Email Copied!"
                : "Copy Email: prateeksinghrajawat2006@gmail.com"
            }
            aria-label="Copy Email"
            className={buttonVariants({
              variant: "outline",
              className: cn(
                "w-10 h-10 p-0 flex items-center justify-center shrink-0 rounded-xl hover:scale-105 transition-all cursor-pointer relative",
                copied &&
                  "border-emerald-500 text-emerald-500 bg-emerald-500/10",
              ),
            })}
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-500 animate-in zoom-in-50 duration-200" />
            ) : (
              <Mail className="w-5.5 h-5.5" />
            )}
          </button>

          <a
            href="https://github.com/PrateekSingh2"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            aria-label="GitHub"
            className={buttonVariants({
              variant: "outline",
              className:
                "w-10 h-10 p-0 flex items-center justify-center shrink-0 rounded-xl hover:scale-105 transition-transform",
            })}
          >
            <GithubIcon className="w-5.5 h-5.5" />
          </a>

          <a
            href="https://www.linkedin.com/in/rajawatprateeksingh/"
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
            className={buttonVariants({
              variant: "outline",
              className:
                "w-10 h-10 p-0 flex items-center justify-center shrink-0 rounded-xl hover:scale-105 transition-transform",
            })}
          >
            <LinkedinIcon className="w-5.5 h-5.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
