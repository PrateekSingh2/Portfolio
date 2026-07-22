"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 8) + 2; 
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setIsFinished(true), 300); // Brief pause at 100%
      }
      setProgress(p);
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFinished) {
      setIsRevealing(true);
      // Wait for all columns to finish sliding up (0.5s duration + up to 0.4s delay)
      const timeout = setTimeout(() => {
        onComplete();
      }, 1200); 
      return () => clearTimeout(timeout);
    }
  }, [isFinished, onComplete]);

  // 5 Vertical Columns for the staggered reveal
  const columns = [0, 1, 2, 3, 4];

  return (
    <div className="fixed inset-0 z-[100] flex w-full h-full pointer-events-none overflow-hidden">
      
      {/* 5 Staggered Columns */}
      {columns.map((col) => (
        <motion.div
          key={col}
          initial={{ y: 0 }}
          animate={isRevealing ? { y: "-100%" } : { y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1], // Custom cinematic easing
            delay: col * 0.08,        // Stagger effect
          }}
          className="relative h-full flex-1 bg-[#050505] border-r border-primary/10 last:border-r-0"
        >
          {/* Subtle golden noise or overlay inside each column if desired */}
        </motion.div>
      ))}

      {/* Center Loading UI (Fades out before columns slide) */}
      <AnimatePresence>
        {!isRevealing && (
          <motion.div
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Minimalist Golden Circular Progress */}
            <div className="relative flex items-center justify-center w-48 h-48">
              
              {/* Background Ring */}
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  className="text-primary/20" 
                />
              </svg>

              {/* Progress Ring */}
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                <motion.circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  className="text-primary shadow-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  initial={{ strokeDasharray: "301.59", strokeDashoffset: "301.59" }}
                  animate={{ strokeDashoffset: 301.59 - (301.59 * progress) / 100 }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </svg>

              {/* Percentage Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-light text-primary font-mono tracking-tighter">
                  {progress}
                </span>
                <span className="text-[10px] tracking-[0.3em] text-primary/60 mt-2 uppercase font-medium">
                  Loading
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
