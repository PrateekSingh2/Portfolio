"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function InteractiveBackground() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none"
    >
      {/* =========================================================================
          LIGHT THEME: Complete replica of reference background with sand particles
          - Left: Warm glowing peach / apricot (#FFEBD8 / #FFE8D4)
          - Center: Soft blush rose (#FFE4E8 / #FFE3EF)
          - Right: Delicate lilac / lavender (#FFE4FC / #FDEBFF)
          - Fine stippled sand particles / paper grit texture
         ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Layer 1: High-resolution lossless seamless sand background asset */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/ambient-mesh-bg.png')",
          }}
        />

        {/* Layer 2: Ambient CSS Mesh Gradient for rich color depth */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 70% 65% at 5% 85%, rgba(255, 222, 195, 0.7), transparent 60%),
              radial-gradient(ellipse 65% 55% at 0% 30%, rgba(255, 236, 218, 0.65), transparent 55%),
              radial-gradient(ellipse 70% 60% at 95% 15%, rgba(255, 215, 250, 0.75), transparent 65%),
              radial-gradient(ellipse 60% 55% at 90% 85%, rgba(250, 225, 255, 0.65), transparent 60%),
              radial-gradient(ellipse 65% 50% at 52% 40%, rgba(255, 228, 240, 0.55), transparent 65%),
              linear-gradient(105deg, #FFEBD8 0%, #FFE8DE 16%, #FFE5E4 28%, #FFE3E9 42%, #FFE3EF 55%, #FFE5F5 68%, #FFE4FC 82%, #FDEBFF 100%)
            `,
            mixBlendMode: "multiply",
            opacity: 0.25,
          }}
        />

        {/* Layer 3: Subtle dynamic ambient cursor lighting */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle 420px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 248, 240, 0.35), transparent 80%)`,
          }}
        />

        {/* Layer 4: High-frequency Fine Sand Particles Overlay (SVG FractalNoise) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sandGrit'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 0 0.18  0 0 0 0.28 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sandGrit)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "160px 160px",
          }}
        />

        {/* Layer 5: Fine speckle noise for tactile paper / sand grit depth */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-35"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fineSpeckles'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fineSpeckles)' opacity='0.35'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "140px 140px",
          }}
        />
      </div>

      {/* =========================================================================
          DARK THEME: Ultra-Premium Deep Obsidian Aurora & Interactive Cosmic Grit
         ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Layer 1: Base Deep Obsidian Canvas */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(180deg, #090c10 0%, #0b0f16 50%, #07090d 100%)",
          }}
        />

        {/* Layer 2: Radiant Aurora Mesh Glows */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 12% 15%, rgba(56, 189, 248, 0.12), transparent 60%),
              radial-gradient(ellipse 75% 60% at 88% 78%, rgba(99, 102, 241, 0.13), transparent 65%),
              radial-gradient(ellipse 50% 45% at 92% 18%, rgba(168, 85, 247, 0.09), transparent 55%),
              radial-gradient(ellipse 55% 50% at 8% 75%, rgba(16, 185, 129, 0.08), transparent 55%),
              radial-gradient(ellipse 60% 40% at 50% 45%, rgba(30, 58, 138, 0.08), transparent 60%)
            `,
            mixBlendMode: "screen",
          }}
        />

        {/* Layer 3: Dynamic Ambient Cursor Aura */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle 480px at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, 0.08), rgba(99, 102, 241, 0.04) 40%, transparent 80%)`,
          }}
        />

        {/* Layer 4: Fine Cosmic Grit / Stippled Noise Texture */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='darkGrit'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23darkGrit)' opacity='0.35'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "150px 150px",
          }}
        />
      </div>
    </div>
  );
}
