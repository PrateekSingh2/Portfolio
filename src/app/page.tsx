"use client";

import { HeroSection }         from "@/components/sections/HeroSection";
import { EducationExperience } from "@/components/sections/EducationExperience";
import { EngineeringSnapshot } from "@/components/sections/EngineeringSnapshot";
import { CPDashboard }         from "@/components/sections/CPDashboard";
import { Certifications }       from "@/components/sections/Certifications";
import { CoreSkills }          from "@/components/sections/CoreSkills";
import { GithubAnalytics }     from "@/components/sections/GithubAnalytics";
import { FeaturedProjects }    from "@/components/sections/FeaturedProjects";
import { Footer }              from "@/components/layout/Footer";
import { Spotlight }           from "@/components/ui/Spotlight";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { Preloader }           from "@/components/ui/Preloader";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Divider() {
  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      <div className="border-t border-border/20" />
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

      <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">
        <Spotlight />
        <InteractiveBackground />
        
        {booted && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full"
          >
            <HeroSection />
            <Divider />
            <EducationExperience />
            <Divider />
            <EngineeringSnapshot />
            <Divider />
            <CPDashboard />
            <Divider />
            <Certifications />
            <Divider />
            <CoreSkills />
            <Divider />
            <GithubAnalytics />
            <Divider />
            <FeaturedProjects />
            <Divider />
            <Footer />
          </motion.div>
        )}
      </div>
    </>
  );
}
