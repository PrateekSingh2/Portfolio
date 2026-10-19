"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        const clamped = Math.min(100, Math.max(0, currentProgress));
        setProgress(clamped);
        setVisible(window.scrollY > 80);
      } else {
        setProgress(0);
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Circular progress calculations
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-90"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={`Scroll to top (${Math.round(progress)}% scrolled)`}
        title={`Scroll to top (${Math.round(progress)}%)`}
        className="pointer-events-auto relative w-11 h-11 rounded-full flex items-center justify-center bg-background/85 hover:bg-background backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-90 group border border-black/5 dark:border-white/10"
      >
        {/* SVG Circular Progress Track */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 44 44"
        >
          {/* Background circle track */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-black/10 dark:stroke-white/15 fill-none"
            strokeWidth="2.5"
          />
          {/* Dynamic Fill Progress circle */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-primary fill-none transition-[stroke-dashoffset] duration-150 ease-out"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Icon */}
        <ArrowUp className="w-4 h-4 text-foreground group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
}
