"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Lightbulb } from "lucide-react";

export interface JobRole {
  id: string;
  role: string;
  startDate: string; // "YYYY-MM"
  endDate?: string | null; // "YYYY-MM" or null for Present
  icon?: "code" | "founder";
  tech: string[];
  responsibilities: string[];
}

export interface ExperienceCompany {
  id: string;
  company: string;
  companyLink: string;
  location: string;
  status: "Working" | "Completed";
  roles: JobRole[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Dynamically calculates timeline string and month/year duration
function getTimelineDetails(
  startDateStr: string,
  endDateStr?: string | null
): { formattedTimeline: string; duration: string } {
  const [startYear, startMonth] = startDateStr.split("-").map(Number);
  const isPresent = !endDateStr || endDateStr.toLowerCase() === "present";

  const now = new Date();
  const endYear = isPresent ? now.getFullYear() : Number(endDateStr.split("-")[0]);
  const endMonth = isPresent ? now.getMonth() + 1 : Number(endDateStr.split("-")[1]);

  const startFormatted = `${MONTH_NAMES[startMonth - 1]} ${startYear}`;
  const endFormatted = isPresent ? "Present" : `${MONTH_NAMES[endMonth - 1]} ${endYear}`;
  const formattedTimeline = `${startFormatted} - ${endFormatted}`;

  // Inclusive month calculation
  const totalMonths = Math.max(
    1,
    (endYear - startYear) * 12 + (endMonth - startMonth) + 1
  );
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let duration = "";
  if (years === 0) {
    duration = `${totalMonths} ${totalMonths === 1 ? "mo" : "mos"}`;
  } else if (months === 0) {
    duration = `${years} ${years === 1 ? "yr" : "yrs"}`;
  } else {
    duration = `${years} ${years === 1 ? "yr" : "yrs"} ${months} ${months === 1 ? "mo" : "mos"}`;
  }

  return { formattedTimeline, duration };
}

const EXPERIENCES: ExperienceCompany[] = [
  {
    id: "algolib",
    company: "AlgoLib",
    companyLink: "https://algolib.netlify.app/",
    location: "Gwalior, India",
    status: "Working",
    roles: [
      {
        id: "algolib-founder",
        role: "Founder & CEO",
        startDate: "2026-03",
        endDate: null, // Present
        icon: "founder",
        tech: [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "Express",
          "PostgreSQL",
          "Docker",
        ],
        responsibilities: [
          "Designed and implemented automatic new ML research paper pulling, summarization, and categorization pipelines using Python, FastAPI, and PostgreSQL.",
          "Engineered an online judge and code execution environment for multiple programming languages with handling capacity for 500+ events per minute with 99.9% uptime using dockerized containers and a robust queue system with round-robin scheduling.",
          "Leading the Team: Managing a 5-person team (including UI/UX, testing, and marketing) to turn a personal project into a real, usable product.",
        ],
      },
      {
        id: "algolib-lead",
        role: "Lead Developer",
        startDate: "2026-01",
        endDate: "2026-03",
        icon: "code",
        tech: [
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Node.js",
          "PostgreSQL",
        ],
        responsibilities: [
          "Building AlgoLib, an interactive website that makes learning Data Structures and Algorithms (DSA) visual and easy to understand.",
          "Writing the Code: Developing the core front-end using React.js, TypeScript, Tailwind CSS.",
        ],
      },
    ],
  },
  {
    id: "decodelabs",
    company: "DecodeLabs",
    companyLink: "https://www.decodelabs.tech/",
    location: "Remote",
    status: "Completed",
    roles: [
      {
        id: "decodelabs-python",
        role: "Python Developer Intern",
        startDate: "2026-06",
        endDate: "2026-07",
        icon: "code",
        tech: [
          "Python",
          "FastAPI",
          "SQLite",
          "Git",
          "Linux",
          "Matplotlib",
          "Pandas",
        ],
        responsibilities: [
          "Developed a Python-based expense calculation and reporting system with an intuitive UI and automated ledger processing.",
          "Implemented data visualization pipelines using Matplotlib and Pandas, reducing manual financial reporting effort by 30%.",
          "Collaborated cross-functionally with backend mentors to write modular, well-structured code with comprehensive test coverage.",
        ],
      },
    ],
  },
];

function CompanyLogo({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img
        src={`/images/${companyId}.png`}
        alt={companyName}
        onError={() => setImgError(true)}
        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md object-contain shrink-0"
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 flex items-center justify-center font-mono font-bold text-[11px] text-foreground shrink-0 select-none">
      {companyName.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function ExperienceSection() {
  const [expandedRoles, setExpandedRoles] = React.useState<Record<string, boolean>>({});

  const toggleRole = (roleId: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  return (
    <section
      className="py-14 px-4 max-w-3xl mx-auto w-full relative"
      id="experience"
    >
      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-foreground mb-8">
        Experience
      </h2>

      {/* Companies List */}
      <div className="space-y-8">
        {EXPERIENCES.map((comp) => (
          <div
            key={comp.id}
            className="pb-8 border-b border-black/[0.08] dark:border-white/[0.08] last:border-b-0 last:pb-0"
          >
            {/* Company Header Row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Left: Company Logo & Hyperlink (No external Lucide icon) */}
              <div className="flex items-center gap-2.5">
                <CompanyLogo companyId={comp.id} companyName={comp.company} />
                <a
                  href={comp.companyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg font-bold font-sans text-foreground hover:text-primary transition-colors"
                >
                  {comp.company}
                </a>
              </div>

              {/* Right: Location & Blinking Dot (if active working role) */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-sans text-muted-foreground shrink-0">
                <span>{comp.location}</span>
                {comp.status === "Working" && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                  </span>
                )}
              </div>
            </div>

            {/* Branching Internal Job Roles */}
            <div className="relative ml-3 sm:ml-3.5 border-l border-black/10 dark:border-white/10 mt-3.5 space-y-7">
              {comp.roles.map((role) => {
                const isExpanded = !!expandedRoles[role.id];
                const { formattedTimeline, duration } = getTimelineDetails(
                  role.startDate,
                  role.endDate
                );

                return (
                  <div key={role.id} className="relative pl-7 sm:pl-8 group">
                    {/* Node Icon on the Branch Line */}
                    <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-lg bg-background border border-black/15 dark:border-white/15 flex items-center justify-center text-muted-foreground text-xs font-mono font-medium shrink-0 shadow-xs z-10 select-none">
                      {role.icon === "founder" ? (
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <span>&lt;/&gt;</span>
                      )}
                    </div>

                    {/* Role Header: Regular Font Title & Expand Chevrons */}
                    <div
                      onClick={() => toggleRole(role.id)}
                      className="cursor-pointer select-none"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Role Name (Regular font weight without extra present badge) */}
                        <h3 className="text-sm sm:text-base font-normal font-sans text-foreground group-hover:text-primary transition-colors">
                          {role.role}
                        </h3>

                        {/* Expand Button */}
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded
                              ? `Collapse details for ${role.role}`
                              : `Expand details for ${role.role}`
                          }
                          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ChevronsUpDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isExpanded ? "text-primary" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Subtitle: Jan 2026 - Present · 8 mos */}
                      <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground mt-0.5">
                        <span>{formattedTimeline}</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span>{duration}</span>
                      </div>
                    </div>

                    {/* Tech Stack Pills Format */}
                    {role.tech.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        {role.tech.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-mono text-muted-foreground bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expandable Bullet Points - Collapsed by default */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden pt-3.5"
                        >
                          <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-muted-foreground leading-relaxed pl-1">
                            {role.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-muted-foreground/60 mt-0.5">
                                  •
                                </span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
