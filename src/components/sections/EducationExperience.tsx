"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase, FileText, Globe } from "lucide-react";

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  bullets: string[];
  badge?: string;
  logo?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  buttonText?: string;
  buttonLink?: string;
  logo?: string;
}

const EDUCATION_DATA: EducationItem[] = [
  {
    id: "mits",
    institution: "Madhav Institute of Technology & Science",
    degree: "B.Tech in Artificial Intelligence and Machine Learning",
    period: "Aug 2021 – May 2025",
    location: "Gwalior, India",
    logo: "images/mits.webp",
    bullets: [
      "CPI: 8.6 CGPA",
      "Coursework in AI",
    ],
  },
  {
    id: "vpcs",
    institution: "Vidyavati Public Central School",
    degree: "Senior Secondary Education – PCM (Physics, Chemistry, Mathematics)",
    period: "April 2023 – May 2024",
    location: "Bhind, India",
    logo: "/images/vpcs.webp",
    bullets: [
      "Completed 12th grade with Physics, Chemistry, and Mathematics as core subjects",
    ],
  },
];

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "algolib",
    company: "AlgoLib",
    role: "Founder & Lead Engineer",
    period: "Jan 2026 – Present",
    location: "Gwalior, India",
    logo: "/images/algolib.png",
    bullets: [
      "Founded AlgoLib, a platform for algorithm enthusiasts to learn and visualize data structures",
      "Developed interactive visualizations for various data structures and ML algorithms",
      "Online compiler and code execution environment for multiple programming languages",
    ],
    buttonText: "About Company",
    buttonLink: "https://algolib.netlify.app/",
  },
  {
    id: "decodelabs",
    company: "DecodeLabs",
    role: "Python Developer Intern",
    period: "June 2026 – July 2026",
    location: "Remote",
    logo: "/images/decodelabs.png",
    bullets: [
      "Developed a Python-based expense tracker application with a user-friendly interface",
    ],
    buttonText: "About Company",
    buttonLink: "https://www.decodelabs.tech/",
  },
];

function ItemLogo({
  src,
  alt,
  fallbackIcon,
}: {
  src?: string;
  alt: string;
  fallbackIcon: React.ReactNode;
}) {
  const [hasError, setHasError] = React.useState(false);

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className="w-11 h-11 rounded-xl object-contain bg-muted/60 border border-border/60 p-1 shrink-0"
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-11 h-11 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center text-primary shrink-0">
      {fallbackIcon}
    </div>
  );
}

export function EducationExperience() {
  const [activeTab, setActiveTab] = React.useState<"education" | "experience">("experience");

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto w-full relative" id="education">
      {/* Top Toggle Bar */}
      <div className="flex justify-start mb-8">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-card/80 border border-border/80 shadow-md backdrop-blur-md">
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-8 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "experience"
                ? "bg-primary text-primary-foreground shadow-md font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-8 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "education"
                ? "bg-primary text-primary-foreground shadow-md font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Education
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "education" ? (
          <motion.div
            key="education"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {EDUCATION_DATA.map((edu) => (
              <div
                key={edu.id}
                className="bg-card/80 backdrop-blur-md border border-border/80 hover:border-primary/40 rounded-2xl p-6 sm:p-7 relative overflow-hidden group shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <ItemLogo
                      src={edu.logo}
                      alt={edu.institution}
                      fallbackIcon={<GraduationCap className="w-6 h-6" />}
                    />
                    <div>
                      <h3 className="text-lg font-bold font-sans text-foreground">
                        {edu.institution}
                      </h3>
                      <p className="text-sm text-primary font-sans font-semibold mt-0.5">
                        {edu.degree}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-muted-foreground text-left sm:text-right shrink-0">
                    <p>{edu.period}</p>
                    <p className="text-muted-foreground/80">{edu.location}</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm font-sans text-foreground/90 leading-relaxed mb-5 pl-1">
                  {edu.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {edu.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-secondary-foreground font-mono text-xs font-semibold shadow-sm border border-border/40">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{edu.badge}</span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="experience"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {EXPERIENCE_DATA.map((exp) => (
              <div
                key={exp.id}
                className="bg-card/80 backdrop-blur-md border border-border/80 hover:border-primary/40 rounded-2xl p-6 sm:p-7 relative overflow-hidden group shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <ItemLogo
                      src={exp.logo}
                      alt={exp.company}
                      fallbackIcon={<Briefcase className="w-6 h-6" />}
                    />
                    <div>
                      <h3 className="text-lg font-bold font-sans text-foreground">
                        {exp.company}
                      </h3>
                      <p className="text-sm text-primary font-sans font-semibold mt-0.5">
                        {exp.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-muted-foreground text-left sm:text-right shrink-0">
                    <p>{exp.period}</p>
                    <p className="text-muted-foreground/80">{exp.location}</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm font-sans text-foreground/90 leading-relaxed mb-5 pl-1">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {exp.buttonText && (
                  <a
                    href={exp.buttonLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground font-mono text-xs font-semibold shadow-sm hover:bg-secondary/80 transition-colors cursor-pointer border border-border/40"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{exp.buttonText}</span>
                  </a>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
