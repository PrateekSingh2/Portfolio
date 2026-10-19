"use client";

import React, { useEffect, useState } from "react";

const TOTAL_DASHES = 12;

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on mobile viewports (< 768px)
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
        setIsVisible(window.scrollY > 80);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashClick = (index: number) => {
    const targetProgress = index / (TOTAL_DASHES - 1);
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * targetProgress,
      behavior: "smooth",
    });
  };

  const activeDashIndex = Math.min(
    TOTAL_DASHES - 1,
    Math.floor((progress / 100) * TOTAL_DASHES),
  );

  return (
    <div
      className={`hidden md:block fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 pointer-events-none ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="flex flex-col items-end gap-1 group pointer-events-auto select-none">
        {/* Scroll Percentage Tooltip Badge */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-mono font-bold text-white bg-black/40 dark:bg-black/40 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-md shadow-lg mb-1 whitespace-nowrap drop-shadow">
          {Math.round(progress)}%
        </div>

        {/* Floating Stacked Horizontal Dash Lines (No Box Wrapper) */}
        <div className="flex flex-col items-end gap-1.5 py-1">
          {Array.from({ length: TOTAL_DASHES }).map((_, idx) => {
            const isFilled = idx <= activeDashIndex;
            const isCurrent = idx === activeDashIndex;

            return (
              <button
                key={idx}
                onClick={() => handleDashClick(idx)}
                title={`Scroll to ${Math.round((idx / (TOTAL_DASHES - 1)) * 100)}%`}
                aria-label={`Scroll depth ${Math.round((idx / (TOTAL_DASHES - 1)) * 100)}%`}
                className={`h-[2.5px] sm:h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? "w-6 sm:w-7 bg-foreground/60 dark:bg-white/50 shadow-sm scale-105"
                    : isFilled
                      ? "w-4 sm:w-5 bg-foreground/25 dark:bg-white/25 hover:w-6 hover:bg-foreground/50 dark:hover:bg-white/50"
                      : "w-3 sm:w-3.5 bg-foreground/10 dark:bg-white/10 hover:bg-foreground/30 dark:hover:bg-white/30 hover:w-5"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
