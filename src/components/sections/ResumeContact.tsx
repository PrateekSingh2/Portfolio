"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ExternalLink, 
  Download, 
  FileText, 
  Mail, 
  ArrowUpRight, 
  Trophy, 
  TrendingUp, 
  Star, 
  Award 
} from "lucide-react";

const CONTACTS = [
  { 
    label: "GitHub", 
    handle: "@PrateekSingh2", 
    href: "https://github.com/PrateekSingh2",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    color: "hover:border-foreground/30 hover:bg-foreground/5 text-foreground"
  },
  { 
    label: "LinkedIn", 
    handle: "rajawatprateeksingh", 
    href: "https://www.linkedin.com/in/rajawatprateeksingh/",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: "hover:border-blue-500/30 hover:bg-blue-500/5 text-[#0A66C2]"
  },
  { 
    label: "Email", 
    handle: "rajawatprateek@gmail.com", 
    href: "mailto:prateeksinghrajawat2006@gmail.com",
    icon: <Mail className="w-5 h-5" />,
    color: "hover:border-emerald-500/30 hover:bg-emerald-500/5 text-[#10b981]"
  },
];

export function ResumeContact() {
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="contact">
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" /> Contact
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Let&apos;s build something impactful. Open to SDE-1, AI, and CP opportunities.
        </p>
      </div>

      {/* Glassmorphic Resume Box */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/30 hover:bg-card/50 transition-all duration-500 shadow-sm hover:shadow-primary/5 rounded-xl mb-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0 group-hover:bg-primary/20 transition-all duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold font-mono text-foreground">Resume</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">Download / View PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm", className: "font-mono text-xs gap-1.5 h-9 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all w-full sm:w-auto" })}
            >
              <ExternalLink className="w-3.5 h-3.5" /> View
            </a>
            <a 
              href="/resume.pdf" 
              download
              className={buttonVariants({ size: "sm", className: "font-mono text-xs gap-1.5 h-9 w-full sm:w-auto shadow-sm" })}
            >
              <Download className="w-3.5 h-3.5" /> Download
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Grid of contact links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {CONTACTS.map((c) => {
          const isEmail = c.href.startsWith("mailto:");
          return (
            <a
              key={c.label}
              href={c.href}
              target={isEmail ? undefined : "_blank"}
              rel={isEmail ? undefined : "noreferrer"}
              className={`flex items-center justify-between p-4 bg-card/20 backdrop-blur-sm border border-border/40 rounded-xl transition-all duration-300 group ${c.color}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-background/60 border border-border/40 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform text-muted-foreground group-hover:text-inherit">
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">{c.label}</p>
                  <p className="text-[11px] font-mono text-foreground/80 truncate font-semibold mt-0.5">{c.handle}</p>
                </div>
              </div>
              
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
