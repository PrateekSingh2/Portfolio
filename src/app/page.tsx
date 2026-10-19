"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { GithubAnalytics } from "@/components/sections/GithubAnalytics";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CPDashboard } from "@/components/sections/CPDashboard";
import { CoreSkills } from "@/components/sections/CoreSkills";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { DailyQuote } from "@/components/sections/DailyQuote";
import { Footer } from "@/components/layout/Footer";
import { Spotlight } from "@/components/ui/Spotlight";
import { Preloader } from "@/components/ui/Preloader";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Divider() {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 my-3 sm:my-5">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/25 dark:via-white/20 to-transparent" />
    </div>
  );
}

export default function Home() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasBooted = sessionStorage.getItem("has_booted_portfolio");
      if (hasBooted === "true") {
        setTimeout(() => setBooted(true), 0);
      }
    }
  }, []);

  const handleBootComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("has_booted_portfolio", "true");
    }
    setBooted(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!booted && <Preloader onComplete={handleBootComplete} />}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen bg-transparent text-foreground relative overflow-hidden transition-colors duration-300">
        <Spotlight />

        {booted && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full"
          >
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. GitHub Activity Heatmap (Directly below Hero without labels) */}
            <GithubAnalytics />

            <Divider />

            {/* 3. Work Experience (Swapped: Experience first) */}
            <ExperienceSection />

            <Divider />

            {/* 4. Education (Swapped: Education second) */}
            <EducationSection />

            <Divider />

            {/* 5. Competitive Programming Dashboard */}
            <CPDashboard />

            <Divider />

            {/* 6. Core Skills */}
            <CoreSkills />

            <Divider />

            {/* 7. Featured Projects */}
            <FeaturedProjects />

            <Divider />

            {/* 8. Daily Quote */}
            <DailyQuote />

            <Divider />

            {/* 9. Footer */}
            <Footer />
          </motion.div>
        )}
      </div>
    </>
  );
}
