"use client";

import React from "react";
import { motion } from "framer-motion";

// 3D Isometric "P" and "S" - Aligned along the isometric diagonal (P at lower-left, S at upper-right)
// Monolithic architectural surfaces with true cutout aperture on P and grounded extrusion walls
const P_GEOMETRY = {
  topFaces:
    "M39.63 191.0L171.27 115.0L302.9 191.0L204.17 248.0L237.08 267.0L204.17 286.0Z M105.45 191.0L171.27 153.0L237.08 191.0L171.27 229.0Z",
  walls:
    "M39.63 191.0L204.17 286.0L204.17 310.0L39.63 215.0Z M204.17 286.0L237.08 267.0L237.08 291.0L204.17 310.0Z M204.17 248.0L302.9 191.0L302.9 215.0L204.17 272.0Z M105.45 191.0L171.27 153.0L171.27 177.0L105.45 215.0Z M171.27 153.0L237.08 191.0L237.08 215.0L171.27 177.0Z",
  strokes:
    "M39.63 191.0L171.27 115.0 M171.27 115.0L302.9 191.0 M302.9 191.0L204.17 248.0 M204.17 248.0L237.08 267.0 M237.08 267.0L204.17 286.0 M204.17 286.0L39.63 191.0 M105.45 191.0L171.27 153.0 M171.27 153.0L237.08 191.0 M237.08 191.0L171.27 229.0 M171.27 229.0L105.45 191.0 M39.63 191.0V215.0 M204.17 286.0V310.0 M237.08 267.0V291.0 M302.9 191.0V215.0 M171.27 153.0V177.0 M39.63 215.0L204.17 310.0 M204.17 310.0L237.08 291.0 M204.17 272.0L302.9 215.0 M105.45 215.0L171.27 177.0 M171.27 177.0L237.08 215.0",
};

const S_GEOMETRY = {
  topFaces:
    "M204.17 96.0L335.81 20.0L368.72 39.0L269.99 96.0L302.9 115.0L401.63 58.0L500.36 115.0L368.72 191.0L335.81 172.0L434.54 115.0L401.63 96.0L302.9 153.0Z",
  walls:
    "M204.17 96.0L269.99 134.0L269.99 158.0L204.17 120.0Z M269.99 96.0L368.72 39.0L368.72 63.0L269.99 120.0Z M302.9 153.0L401.63 96.0L401.63 120.0L302.9 177.0Z M401.63 96.0L434.54 115.0L434.54 139.0L401.63 120.0Z M335.81 172.0L368.72 191.0L368.72 215.0L335.81 196.0Z M368.72 191.0L500.36 115.0L500.36 139.0L368.72 215.0Z",
  strokes:
    "M204.17 96.0L335.81 20.0 M335.81 20.0L368.72 39.0 M368.72 39.0L269.99 96.0 M269.99 96.0L302.9 115.0 M302.9 115.0L401.63 58.0 M401.63 58.0L500.36 115.0 M500.36 115.0L368.72 191.0 M368.72 191.0L335.81 172.0 M335.81 172.0L434.54 115.0 M434.54 115.0L401.63 96.0 M401.63 96.0L302.9 153.0 M302.9 153.0L204.17 96.0 M204.17 96.0V120.0 M269.99 134.0V158.0 M368.72 39.0V63.0 M302.9 153.0V177.0 M401.63 96.0V120.0 M335.81 172.0V196.0 M368.72 191.0V215.0 M500.36 115.0V139.0 M204.17 120.0L269.99 158.0 M269.99 120.0L368.72 63.0 M302.9 177.0L401.63 120.0 M401.63 120.0L434.54 139.0 M335.81 196.0L368.72 215.0 M368.72 215.0L500.36 139.0",
};

// Hit area polygon tightly wrapping both P and S and the gap between them
const HIT_AREA_PATH = "M39.63 191.0L335.81 20.0L500.36 139.0L204.17 310.0Z";

// Tactile mechanical keyboard switch sound (data URI) for 0-latency instant playback
const MECHANICAL_CLICK_DATA_URI =
  "data:audio/mpeg;base64,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";

// Shared Web Audio API context & pre-decoded audio buffer
let sharedAudioCtx: AudioContext | null = null;
let decodedClickBuffer: AudioBuffer | null = null;
let isDecoding = false;

async function getOrDecodeAudioBuffer(): Promise<{
  ctx: AudioContext;
  buffer: AudioBuffer | null;
} | null> {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") {
      await sharedAudioCtx.resume();
    }

    if (!decodedClickBuffer && !isDecoding) {
      isDecoding = true;
      try {
        const base64 = MECHANICAL_CLICK_DATA_URI.split(",")[1];
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        decodedClickBuffer = await sharedAudioCtx.decodeAudioData(bytes.buffer.slice(0));
      } finally {
        isDecoding = false;
      }
    }

    return { ctx: sharedAudioCtx, buffer: decodedClickBuffer };
  } catch {
    return null;
  }
}

export function HeroBlueprint() {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 270, y: 165 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);

  // Pre-warm the mechanical switch audio buffer on mount so clicks trigger instantaneously
  React.useEffect(() => {
    getOrDecodeAudioBuffer().catch(() => {});
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 540;
    const y = ((e.clientY - rect.top) / rect.height) * 330;
    setMousePos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((touch.clientX - rect.left) / rect.width) * 540;
    const y = ((touch.clientY - rect.top) / rect.height) * 330;
    setMousePos({ x, y });
  };

  // Plays a rich, pleasant tactile mechanical keyboard button click
  const playMechanicalClickSound = async () => {
    try {
      const res = await getOrDecodeAudioBuffer();
      if (res?.ctx && res.buffer) {
        const source = res.ctx.createBufferSource();
        source.buffer = res.buffer;

        // Pleasant volume level
        const gain = res.ctx.createGain();
        gain.gain.setValueAtTime(0.85, res.ctx.currentTime);

        source.connect(gain);
        gain.connect(res.ctx.destination);
        source.start(0);
        return;
      }
    } catch {
      // Audio fallback below
    }

    // Graceful fallback to HTML5 Audio element
    try {
      const audio = new Audio(MECHANICAL_CLICK_DATA_URI);
      audio.volume = 0.8;
      audio.play();
    } catch {
      // Autoplay or audio disabled fallback
    }
  };

  // Clicking on P, S, OR the space between them triggers the sound & spring animation together
  const handleArtClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playMechanicalClickSound();
    setClicked(true);
    setTimeout(() => setClicked(false), 320);
  };

  const uniqueId = "hero-ps-grand";

  return (
    <figure className="relative w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[450px] mx-auto mb-4 sm:mb-5 select-none outline-none focus:outline-none [-webkit-tap-highlight-color:transparent]">
      <svg
        ref={svgRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseEnter={() => {
          setIsHovered(true);
          getOrDecodeAudioBuffer().catch(() => {});
        }}
        onMouseLeave={() => setIsHovered(false)}
        viewBox="0 0 540 330"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-auto w-full touch-manipulation overflow-visible outline-none focus:outline-none select-none [-webkit-tap-highlight-color:transparent] [--pattern:color-mix(in_oklab,var(--foreground)_14%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_18%,var(--background))] [--stroke-line:color-mix(in_oklab,var(--foreground)_8%,var(--background))]"
        style={{ outline: "none" }}
      >
        <defs>
          {/* Architectural diagonal hatching pattern for top faces */}
          <pattern
            id={`${uniqueId}-pattern`}
            x="0"
            y="0"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-1 1l2 -2M0 8l8 -8M7 9l2 -2"
              stroke="var(--pattern)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Interactive cursor tracking spotlight gradient */}
          <radialGradient
            id={`${uniqueId}-radial`}
            r="190"
            gradientUnits="userSpaceOnUse"
            cx={mousePos.x}
            cy={mousePos.y}
          >
            <stop
              offset="0%"
              className="dark:[stop-color:#38bdf8] [stop-color:#3b82f6]"
              stopOpacity="0.9"
            />
            <stop
              offset="45%"
              className="dark:[stop-color:#a855f7] [stop-color:#6366f1]"
              stopOpacity="0.5"
            />
            <stop
              offset="100%"
              className="dark:[stop-color:#000000] [stop-color:#ffffff]"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* Ambient isometric background dashed projection lines (non-clickable) */}
        <g
          stroke="var(--stroke-line)"
          strokeWidth="0.85"
          strokeDasharray="4 3"
          className="pointer-events-none"
        >
          {/* Diagonal axis passing through the characters along the isometric grid */}
          <path d="M56.08 276.5L483.9 29.5" />
          <path d="M39.63 115.0L335.81 286.0" />
          <path d="M204.17 20.0L500.36 191.0" />
        </g>

        {/* Unified Interactive 3D PS Artwork - Includes both characters and the space between them */}
        <motion.g
          id="ps-unified-interactive"
          onClick={handleArtClick}
          animate={clicked ? { scale: [1, 0.965, 1.02, 1] } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="cursor-pointer select-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 [-webkit-tap-highlight-color:transparent]"
          style={{ transformOrigin: "270px 165px", outline: "none" }}
          aria-label="Interactive 3D PS Artwork"
          tabIndex={-1}
        >
          {/* Transparent hit area: Covers P, S, AND the space between them so clicking anywhere triggers sound */}
          <path
            d={HIT_AREA_PATH}
            fill="transparent"
            className="cursor-pointer outline-none focus:outline-none"
            style={{ outline: "none" }}
          />

          {/* Character P - Lower-Left Position on Isometric Grid */}
          <g id="char-p" className="pointer-events-none">
            {/* Extruded 3D Walls with Downward Grounded Presence */}
            <path
              d={P_GEOMETRY.walls}
              className="fill-background/95 transition-colors duration-200"
            />
            <path
              d={P_GEOMETRY.walls}
              fill={`url(#${uniqueId}-pattern)`}
              opacity="0.45"
            />

            {/* Solid Top Faces with Open Center Hole */}
            <path
              d={P_GEOMETRY.topFaces}
              fillRule="evenodd"
              className="fill-background transition-colors duration-200"
            />
            {/* Top Faces Hatch Pattern */}
            <path
              d={P_GEOMETRY.topFaces}
              fillRule="evenodd"
              fill={`url(#${uniqueId}-pattern)`}
            />

            {/* Wireframe Strokes */}
            <path
              d={P_GEOMETRY.strokes}
              stroke="var(--stroke)"
              strokeWidth="1.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Spotlight Accent */}
            <path
              d={P_GEOMETRY.strokes}
              stroke={`url(#${uniqueId}-radial)`}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-opacity duration-150"
              style={{ opacity: isHovered ? 1 : 0.6 }}
            />
          </g>

          {/* Character S - Upper-Right Position on Isometric Grid */}
          <g id="char-s" className="pointer-events-none">
            {/* Extruded 3D Walls with Downward Grounded Presence */}
            <path
              d={S_GEOMETRY.walls}
              className="fill-background/95 transition-colors duration-200"
            />
            <path
              d={S_GEOMETRY.walls}
              fill={`url(#${uniqueId}-pattern)`}
              opacity="0.45"
            />

            {/* Solid Top Faces */}
            <path
              d={S_GEOMETRY.topFaces}
              className="fill-background transition-colors duration-200"
            />
            {/* Top Faces Hatch Pattern */}
            <path
              d={S_GEOMETRY.topFaces}
              fill={`url(#${uniqueId}-pattern)`}
            />

            {/* Wireframe Strokes */}
            <path
              d={S_GEOMETRY.strokes}
              stroke="var(--stroke)"
              strokeWidth="1.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Spotlight Accent */}
            <path
              d={S_GEOMETRY.strokes}
              stroke={`url(#${uniqueId}-radial)`}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-opacity duration-150"
              style={{ opacity: isHovered ? 1 : 0.6 }}
            />
          </g>
        </motion.g>
      </svg>
    </figure>
  );
}
