"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  timeline: string;
  location: string;
  logo: string;
  bullets: string[];
}

const EDUCATION_DATA: EducationItem[] = [
  {
    id: "mits",
    institution: "Madhav Institute of Technology & Science",
    degree: "B.Tech in Artificial Intelligence",
    timeline: "Aug 2025 - May 2029",
    location: "Gwalior, India",
    logo: "/images/mits.webp",
    bullets: [
      "CPI: 8.76 CGPA",
      "Relevant Coursework: Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, Machine Learning & Deep Learning",
    ],
  },
  {
    id: "vpcs",
    institution: "Vidyavati Public Central School",
    degree: "Senior Secondary Education – PCM (Physics, Chemistry, Mathematics)",
    timeline: "April 2023 – May 2024",
    location: "Bhind, India",
    logo: "/images/vpcs.webp",
    bullets: [
      "Completed 12th grade with Physics, Chemistry, and Mathematics as core subjects",
      "Academic focus on Mathematics and Python Problem Solving",
    ],
  },
];

export function EducationSection() {
  // Collapsed by default - matching Experience section behavior
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <section
      className="py-14 px-4 max-w-3xl mx-auto w-full relative"
      id="education"
    >
      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-foreground mb-6">
        Education
      </h2>

      {/* Education Items - Matching Experience section style without outer enclosing box */}
      <div className="space-y-6">
        {EDUCATION_DATA.map((edu) => {
          const isExpanded = expandedId === edu.id;

          return (
            <div
              key={edu.id}
              className="group pb-6 border-b border-black/[0.08] dark:border-white/[0.08] last:border-b-0"
            >
              {/* Flex row with Logo on left and all content on right */}
              <div className="flex items-start gap-3">
                {/* Institution Logo */}
                <img
                  src={edu.logo}
                  alt={edu.institution}
                  className="w-8 h-8 rounded-lg object-contain bg-transparent border border-black/10 dark:border-white/10 p-1 shrink-0 mt-0.5"
                  loading="lazy"
                />

                {/* Content: Header, Degree, and Bullets all aligned together */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-bold font-sans text-foreground">
                          {edu.institution}
                        </span>

                        {/* Expand Chevron Button - Only shown on hover, or when expanded */}
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded
                              ? `Collapse details for ${edu.institution}`
                              : `Expand details for ${edu.institution}`
                          }
                          className={`p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer active:scale-90 ${
                            isExpanded
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-primary" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Degree */}
                      <p className="text-sm font-sans text-muted-foreground font-medium mt-0.5">
                        {edu.degree}
                      </p>
                    </div>

                    {/* Right: Timeline and Location */}
                    <div className="text-xs font-sans text-muted-foreground sm:text-right shrink-0 mt-0.5 sm:mt-0">
                      <p className="font-medium text-foreground/90">{edu.timeline}</p>
                      <p className="text-muted-foreground/80">{edu.location}</p>
                    </div>
                  </div>

                  {/* Collapsed by default - Expanded when chevron is clicked */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="pt-3 space-y-2 overflow-hidden"
                      >
                        <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-muted-foreground leading-relaxed pl-1">
                          {edu.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground/80 mt-0.5">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
