"use client";

import { HeroSection }         from "@/components/sections/HeroSection";
import { Education }           from "@/components/sections/Education";
import { EngineeringSnapshot } from "@/components/sections/EngineeringSnapshot";
import { CPDashboard }         from "@/components/sections/CPDashboard";
import { Certifications }       from "@/components/sections/Certifications";
import { CoreSkills }          from "@/components/sections/CoreSkills";
import { GithubAnalytics }     from "@/components/sections/GithubAnalytics";
import { Experience }          from "@/components/sections/Experience";
import { FeaturedProjects }    from "@/components/sections/FeaturedProjects";
import { ResumeContact }       from "@/components/sections/ResumeContact";
import { Footer }              from "@/components/layout/Footer";
import { Spotlight }           from "@/components/ui/Spotlight";
import { CustomCursor }        from "@/components/ui/CustomCursor";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { Preloader }           from "@/components/ui/Preloader";
import { useState }            from "react";
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

  return (
    <>
      <AnimatePresence mode="wait">
        {!booted && <Preloader onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen relative overflow-hidden">
        <Spotlight />
        <CustomCursor />
        <InteractiveBackground />
        
        {booted && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full"
          >
            <HeroSection />
            <Divider />
            <Education />
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
            <Experience />
            <Divider />
            <FeaturedProjects />
            <Divider />
            <ResumeContact />
            <Footer />
          </motion.div>
        )}
      </div>
    </>
  );
}
