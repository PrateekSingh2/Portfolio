"use client";

import { GraduationCap, Calendar, MapPin, Award, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const education = [
  {
    degree: "Bachelor of Technology",
    major: "Artificial Intelligence",
    institution: "Madhav Institute of Technology and Science, Gwalior",
    location: "Madhya Pradesh, India",
    period: "2025 - 2029",
    cgpa: "8.6 / 10",
    highlights: [
      "DSA", "LLD", "CP", "DBMS", "OS", "CN"
    ],
  },
];

export function Education() {
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="education">
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono mb-2 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" /> Education
        </h2>
        <p className="text-sm text-muted-foreground font-mono">Academic background and relevant coursework.</p>
      </div>

      <div className="space-y-6">
        {education.map((edu, i) => (
          <div 
            key={i} 
            className="group relative bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 md:p-8 hover:bg-card/50 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-primary/5 overflow-hidden"
          >
            {/* Subtle top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0 group-hover:bg-primary/20 transition-all duration-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-mono text-foreground mb-1 group-hover:text-primary transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-primary font-mono font-semibold mb-2">{edu.major}</p>
                  <p className="text-sm text-muted-foreground font-mono">{edu.institution}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 text-xs font-mono text-muted-foreground shrink-0 md:items-end">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  {edu.period}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/70" />
                  {edu.location}
                </div>
                <Badge variant="secondary" className="w-fit font-mono text-xs bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 px-2.5 py-1">
                  <Award className="w-3.5 h-3.5" />
                  CGPA: {edu.cgpa}
                </Badge>
              </div>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary/70" />
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider font-bold">Relevant Coursework</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {edu.highlights.map((h) => (
                  <span 
                    key={h} 
                    className="px-2.5 py-1 text-xs font-mono rounded-md bg-muted/40 border border-border/40 text-muted-foreground hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all duration-200 cursor-default"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
