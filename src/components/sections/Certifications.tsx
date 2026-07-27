"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  Download,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Zap,
  Layers,
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category:
    "Hackathon" | "Competitive Programming" | "DSA & Systems" | "AI & ML";
  color: string;
  badgeColor: string;
  pdfUrl: string;
  description: string;
  skills: string[];
  credentialId: string;
  icon: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: "hackerrank-problem-solving-intermediate",
    title: "Problem Solving (Intermediate)",
    issuer: "HackerRank",
    date: "Verified Credential",
    category: "DSA & Systems",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    badgeColor:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 dark:text-emerald-300",
    pdfUrl: "/ProblemSolvingIntermediate.pdf",
    description:
      "Verified HackerRank certification testing intermediate algorithms, data structures, dynamic programming, tree traversals, and graph optimization problems under timed competitive constraints.",
    skills: [
      "Data Structures",
      "Algorithms",
      "Problem Solving",
      "Graph Optimization",
      "Dynamic Programming",
    ],
    credentialId: "CB7A3AEOE4BF",
    icon: "HackerRank",
  },
  {
    id: "coursera-certification",
    title: "Software Engineering & Algorithms Specialization",
    issuer: "Coursera",
    date: "Verified Credential",
    category: "AI & ML",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    badgeColor:
      "border-blue-500/30 bg-blue-500/10 text-blue-400 dark:text-blue-300",
    pdfUrl: "/Coursera%20SSH0I8PKNBHB.pdf",
    description:
      "Verified Coursera professional certificate demonstrating mastery in software engineering principles, algorithm design, computing systems, and scalable application architectures.",
    skills: [
      "Software Engineering",
      "Computer Science",
      "Algorithms",
      "System Fundamentals",
      "OOP Patterns",
    ],
    credentialId: "SSH0I8PKNBHB",
    icon: "Coursera",
  },
];

export function Certifications() {
  const [activeCertId, setActiveCertId] = React.useState<string>(
    CERTIFICATES[0].id,
  );

  const activeCert =
    CERTIFICATES.find((c) => c.id === activeCertId) || CERTIFICATES[0];

  return (
    <section
      className="py-16 px-4 max-w-3xl mx-auto w-full relative"
      id="certifications"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-primary" /> Verified Credentials &
            Certificates
          </h2>
          <p className="text-sm text-muted-foreground font-mono">
            Authenticated professional certifications, competitive programming
            benchmarks, and specialized diplomas.
          </p>
        </div>
      </div>

      {/* Redesigned Vault Showcase Container */}
      <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Ambient Top Subtle Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Certificate Selector List */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Select Credential
            </div>

            {CERTIFICATES.map((cert) => {
              const isSelected = cert.id === activeCertId;
              return (
                <div
                  key={cert.id}
                  onClick={() => setActiveCertId(cert.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${cert.title}`}
                  className={`p-3.5 rounded-xl border font-mono text-xs cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? "bg-primary/10 border-primary/50 text-foreground shadow-sm ring-1 ring-primary/30"
                      : "bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`p-2 rounded-lg border ${cert.color} shrink-0`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold truncate text-xs text-foreground group-hover:text-primary transition-colors">
                        {cert.issuer}
                      </div>
                      <div className="text-[10.5px] text-muted-foreground truncate font-sans">
                        {cert.title}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground/40 group-hover:translate-x-0.5"}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Certificate Spotlight Card */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCert.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col justify-between p-5 rounded-xl bg-card border border-border/60 shadow-md relative overflow-hidden"
              >
                {/* Background Accent Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Top Badge & Issuer Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-extrabold text-primary flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {activeCert.issuer}
                    </span>

                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold ${activeCert.badgeColor}`}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1 inline-block text-emerald-400" />
                      Verified
                    </Badge>
                  </div>

                  {/* Title & Credential ID */}
                  <h3 className="text-base font-mono font-extrabold text-foreground mb-1 leading-snug">
                    {activeCert.title}
                  </h3>

                  <div className="text-[11px] font-mono text-muted-foreground mb-3 flex items-center gap-2">
                    <span>
                      ID:{" "}
                      <code className="text-foreground/90 bg-muted/50 px-1.5 py-0.5 rounded">
                        {activeCert.credentialId}
                      </code>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed mb-4">
                    {activeCert.description}
                  </p>

                  {/* Verified Skills Cloud */}
                  <div className="mb-5">
                    <div className="text-[10.5px] font-mono text-muted-foreground mb-2 flex items-center gap-1 font-semibold">
                      <Zap className="w-3 h-3 text-primary" /> Verified
                      Competencies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono text-foreground bg-muted/50 border border-border/40 px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-border/30 flex items-center gap-2">
                  <a
                    href={activeCert.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View PDF Document</span>
                  </a>

                  <a
                    href={activeCert.pdfUrl}
                    download
                    title="Download Certificate"
                    className="p-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border/50 transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
