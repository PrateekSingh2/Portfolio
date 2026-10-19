"use client";

import * as React from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  maxSize: number;
  opacity: number;
  color?: string;
}

export function WaterText() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const rippleIdRef = React.useRef(0);
  const lastSpawnRef = React.useRef(0);
  const animFrameRef = React.useRef<number>(0);
  const turbulenceRef = React.useRef<SVGFETurbulenceElement>(null);
  const displacementRef = React.useRef<SVGFEDisplacementMapElement>(null);

  // Animate dynamic water turbulence for living, undulating fluid waves
  React.useEffect(() => {
    let startTime = performance.now();

    const loop = (time: number) => {
      const elapsed = (time - startTime) * 0.002;
      const fx = 0.016 + Math.sin(elapsed * 2) * 0.005;
      const fy = 0.032 + Math.cos(elapsed * 2.4) * 0.007;

      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute("baseFrequency", `${fx} ${fy}`);
      }

      // Animate and fade out water ripples
      setRipples((prev) =>
        prev
          .map((r) => ({
            ...r,
            size: r.size + 4,
            opacity: r.opacity - 0.02,
          }))
          .filter((r) => r.opacity > 0 && r.size < r.maxSize)
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const spawnRipple = (x: number, y: number, isSplash = false) => {
    rippleIdRef.current += 1;
    const newRipple: Ripple = {
      id: rippleIdRef.current,
      x,
      y,
      size: isSplash ? 20 : 10,
      maxSize: isSplash ? 220 : 140,
      opacity: isSplash ? 0.85 : 0.55,
      color: isSplash ? "rgba(56, 189, 248, 0.7)" : undefined,
    };

    setRipples((prev) => [...prev.slice(-10), newRipple]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const now = performance.now();
    if (now - lastSpawnRef.current > 60) {
      lastSpawnRef.current = now;
      spawnRipple(x, y);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Splash ripple on click
    spawnRipple(x, y, true);
    setTimeout(() => spawnRipple(x, y, true), 120);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    spawnRipple(x, y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative w-full overflow-hidden py-3 sm:py-5 select-none cursor-pointer flex items-center justify-center"
    >
      {/* Dynamic SVG Water Turbulence Distortion Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter
            id="water-distortion-fx"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="turbulence"
              baseFrequency="0.016 0.032"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="turbulence"
              scale="16"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Base Translucent Text (Sized to fit 100% on all viewports) */}
      <h2
        className="w-full text-center font-black tracking-tight uppercase leading-none font-sans text-foreground/[0.07] dark:text-white/[0.06] text-[clamp(1.75rem,7.5vw,6.5rem)] whitespace-nowrap transition-colors duration-300"
        aria-hidden="true"
      >
        PRATEEK SINGH
      </h2>

      {/* Layer 2: Interactive Fluid Water Refraction (Masked strictly to cursor area) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150"
        style={{
          opacity: isHovered ? 1 : 0,
          WebkitMaskImage: isHovered
            ? `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 80%)`
            : "none",
          maskImage: isHovered
            ? `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 80%)`
            : "none",
        }}
      >
        <h2
          className="w-full text-center font-black tracking-tight uppercase leading-none font-sans text-[clamp(1.75rem,7.5vw,6.5rem)] whitespace-nowrap bg-gradient-to-r from-sky-400 via-teal-300 to-blue-500 dark:from-sky-300 dark:via-cyan-200 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]"
          style={{
            filter: "url(#water-distortion-fx)",
          }}
          aria-hidden="true"
        >
          PRATEEK SINGH
        </h2>
      </div>

      {/* Layer 3: Dynamic Expanding Water Ripple Rings */}
      {isHovered &&
        ripples.map((r) => (
          <div
            key={r.id}
            className="absolute rounded-full pointer-events-none border border-sky-400/50 dark:border-cyan-300/60 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
            style={{
              left: r.x - r.size / 2,
              top: r.y - r.size / 2,
              width: r.size,
              height: r.size,
              opacity: r.opacity,
            }}
          />
        ))}

      {/* Layer 4: Underwater Caustic Shimmer Light following cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 130px at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.14), transparent 70%)`,
        }}
      />
    </div>
  );
}
