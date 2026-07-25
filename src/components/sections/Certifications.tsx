"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Award, 
  Trophy, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Eye, 
  FileText, 
  ShieldCheck,
  Star
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: "Hackathon" | "Competitive Programming" | "DSA & Systems" | "AI & ML";
  color: string;
  badgeColor: string;
  pdfUrl: string;
  description: string;
  skills: string[];
}

const CERTIFICATES: Certificate[] = [
  {
    id: "hackerrank-problem-solving-intermediate",
    title: "Problem Solving (Intermediate) Certificate",
    issuer: "HackerRank",
    date: "Verified Credential",
    category: "DSA & Systems",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    pdfUrl: "/problem_solving_intermediate%20certificate.pdf",
    description: "Verified HackerRank certification testing intermediate algorithms, data structures, dynamic programming, tree traversals, and graph optimization problems.",
    skills: ["Data Structures", "Algorithms", "Problem Solving", "Graph Optimization"],
  },
  {
    id: "coursera-certification",
    title: "Coursera Verified Specialization Certificate",
    issuer: "Coursera",
    date: "Verified Credential",
    category: "AI & ML",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    pdfUrl: "/Coursera%20SSH0I8PKNBHB.pdf",
    description: "Verified Coursera professional certificate demonstrating mastery in software engineering principles, algorithms, and computing fundamentals.",
    skills: ["Software Engineering", "Computer Science", "Algorithms", "System Fundamentals"],
  },
];

export function Certifications() {
  const [selectedCert, setSelectedCert] = React.useState<Certificate | null>(null);

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="certifications">
      <div className="mb-10">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Certifications & Verified Credentials
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Verified achievements, hackathon titles, and competitive programming benchmarks. Tap to inspect certificate PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CERTIFICATES.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Card
              onClick={() => setSelectedCert(cert)}
              className="relative bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/40 hover:bg-card/60 hover:-translate-y-1 transition-all duration-300 group overflow-hidden h-full cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              {/* Ambient Top Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`p-2 rounded-lg border ${cert.color} shrink-0`}>
                      {cert.category === "Hackathon" ? <Trophy className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                    </div>
                    <Badge variant="outline" className={`font-mono text-[9.5px] px-2 py-0.5 rounded-full font-bold ${cert.badgeColor}`}>
                      <ShieldCheck className="w-3 h-3 mr-1 inline-block text-emerald-400" />
                      Verified
                    </Badge>
                  </div>

                  <h3 className="text-sm font-mono font-bold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
                    {cert.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mb-2">
                    <span>{cert.issuer}</span>
                    <span>{cert.date}</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground/80 font-sans line-clamp-2 leading-snug mb-3">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/20 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 2).map((skill) => (
                      <span key={skill} className="text-[9px] font-mono text-muted-foreground/70 bg-muted/40 px-1.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-primary font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <Eye className="w-3 h-3" /> View PDF
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* PDF Lightbox Modal Dialog */}
      <Dialog open={selectedCert !== null} onOpenChange={(open) => !open && setSelectedCert(null)}>
        {selectedCert && (
          <DialogContent className="max-w-4xl sm:max-w-4xl w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] max-h-[88vh] sm:max-h-[95vh] bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl p-4 sm:p-6 rounded-2xl border-t-2 border-t-primary/50 overflow-y-auto flex flex-col justify-between space-y-3">
            <DialogHeader className="pb-2.5 border-b border-border/30 shrink-0 space-y-2 pr-6">
              <DialogTitle className="text-sm sm:text-lg font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-foreground font-bold leading-tight">
                <span className="flex items-center gap-2 pr-1">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  <span className="font-extrabold text-foreground">{selectedCert.title}</span>
                </span>
                <Badge variant="outline" className={`font-mono text-[9.5px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 ${selectedCert.badgeColor}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400 inline-block" />
                  Verified Credential
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs font-mono text-muted-foreground flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <span>Issued by <strong className="text-foreground font-semibold">{selectedCert.issuer}</strong> • {selectedCert.date}</span>
                <span className="text-[9.5px] sm:text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  {selectedCert.category}
                </span>
              </DialogDescription>
            </DialogHeader>

            {/* Skills chips bar */}
            <div className="flex flex-wrap items-center gap-1.5 py-1.5 px-3 bg-muted/20 rounded-xl border border-border/30 shrink-0 text-xs font-mono">
              <span className="text-[10.5px] sm:text-[11px] text-muted-foreground font-semibold mr-1">Skills Verified:</span>
              {selectedCert.skills.map((s) => (
                <span key={s} className="text-[9.5px] sm:text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold">
                  {s}
                </span>
              ))}
            </div>

            {/* Embedded PDF Viewer Window */}
            <div className="relative w-full h-[40vh] sm:h-[65vh] my-1 rounded-xl border border-border/40 overflow-hidden bg-black/70 shadow-inner flex flex-col items-center justify-center shrink-0">
              <iframe
                src={`${selectedCert.pdfUrl}#toolbar=0`}
                title={selectedCert.title}
                className="w-full h-full border-none rounded-xl"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-border/30 shrink-0">
              <div className="text-[10px] sm:text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Authentic Verified PDF Document</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={selectedCert.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-muted hover:bg-muted/80 text-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-border/40 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  <span>Open PDF</span>
                </a>
                <a
                  href={selectedCert.pdfUrl}
                  download
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-primary text-primary-foreground font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
