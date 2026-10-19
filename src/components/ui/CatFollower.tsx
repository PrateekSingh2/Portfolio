"use client";

import * as React from "react";

// =====================================================================
// High-Fidelity Feline SVG Sprite Follower
// Cute Purple Cat (#A020F0) with Dark Purple Outline (#4A0E4E)
// Dimensions: 80 x 50 viewBox | Display Size: 56px x 35px
// Center of rotation: (28px, 17.5px)
// =====================================================================

const DISPLAY_WIDTH = 56;
const DISPLAY_HEIGHT = 35;

export function CatFollower() {
  const [mounted, setMounted] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const sleepBubbleRef = React.useRef<HTMLDivElement>(null);

  // Direct DOM references for all 12 animation frames
  const idle0Ref = React.useRef<SVGGElement>(null);
  const idle1Ref = React.useRef<SVGGElement>(null);
  const sleep0Ref = React.useRef<SVGGElement>(null);
  const sleep1Ref = React.useRef<SVGGElement>(null);
  const walk0Ref = React.useRef<SVGGElement>(null);
  const walk1Ref = React.useRef<SVGGElement>(null);
  const walk2Ref = React.useRef<SVGGElement>(null);
  const walk3Ref = React.useRef<SVGGElement>(null);
  const run0Ref = React.useRef<SVGGElement>(null);
  const run1Ref = React.useRef<SVGGElement>(null);
  const run2Ref = React.useRef<SVGGElement>(null);
  const run3Ref = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable on mobile and tablet viewports (< 1024px) or non-fine pointers
    if (window.innerWidth < 1024) return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setMounted(true);

    const frameMap: Record<string, React.RefObject<SVGGElement | null>> = {
      idle_0: idle0Ref,
      idle_1: idle1Ref,
      sleep_0: sleep0Ref,
      sleep_1: sleep1Ref,
      walk_0: walk0Ref,
      walk_1: walk1Ref,
      walk_2: walk2Ref,
      walk_3: walk3Ref,
      run_0: run0Ref,
      run_1: run1Ref,
      run_2: run2Ref,
      run_3: run3Ref,
    };

    let activeKey = "idle_0";

    const setFrame = (newKey: string) => {
      if (newKey === activeKey) return;
      const prevEl = frameMap[activeKey]?.current;
      const nextEl = frameMap[newKey]?.current;
      if (prevEl) prevEl.style.display = "none";
      if (nextEl) nextEl.style.display = "inline";
      activeKey = newKey;
    };

    // Initial Coordinates
    const initX = Math.min(window.innerWidth - 100, Math.max(100, window.innerWidth * 0.7));
    const initY = Math.min(window.innerHeight - 100, Math.max(100, window.innerHeight * 0.4));

    const pos = { x: initX, y: initY };
    const mouse = { x: initX, y: initY };

    let currentAngle = 0; // Degrees
    let isFlipped = false; // Vertical flip for anti-upside-down
    let state: "idle" | "sleep" | "walk" | "run" = "idle";
    let animTimer = 0;
    let lastMouseMoveTime = performance.now();
    let isSleeping = false;

    let lastTime = performance.now();
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouseMoveTime = performance.now();

      // Wake up immediately upon mouse movement
      if (isSleeping) {
        isSleeping = false;
        if (sleepBubbleRef.current) {
          sleepBubbleRef.current.style.display = "none";
        }
        if (state === "sleep") {
          state = "idle";
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Angular helper functions
    const getShortestAngleDelta = (fromAngle: number, toAngle: number) => {
      let diff = (toAngle - fromAngle) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return diff;
    };

    const normalizeAngle = (angle: number) => {
      let a = angle % 360;
      if (a > 180) a -= 360;
      if (a <= -180) a += 360;
      return a;
    };

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const targetX = mouse.x;
      const targetY = mouse.y;

      const dx = targetX - pos.x;
      const dy = targetY - pos.y;
      const dist = Math.hypot(dx, dy);

      // ==========================================
      // State Machine with Idle Sitting -> Sleeping
      // ==========================================
      if (state === "idle" || state === "sleep") {
        if (dist >= 44) {
          // Awakens and pursues cursor
          isSleeping = false;
          if (sleepBubbleRef.current) sleepBubbleRef.current.style.display = "none";
          state = dist >= 180 ? "run" : "walk";
        } else {
          // If mouse hasn't moved for 3.5s while cat is sitting, transition to sleep!
          if (!isSleeping && currentTime - lastMouseMoveTime > 3500) {
            isSleeping = true;
            state = "sleep";
            if (sleepBubbleRef.current) sleepBubbleRef.current.style.display = "flex";
          }
        }
      } else if (state === "walk") {
        if (dist < 40) {
          state = "idle";
        } else if (dist >= 180) {
          state = "run";
        }
      } else if (state === "run") {
        if (dist < 40) {
          state = "idle";
        } else if (dist < 170) {
          state = "walk";
        }
      }

      // ==========================================
      // Speed & Movement Physics
      // ==========================================
      let speed = 0;
      if (state === "run") {
        speed = 360;
      } else if (state === "walk") {
        speed = 150;
      }

      if (speed > 0 && dist >= 40) {
        // Clamp step to stop smoothly at ~38px without overshooting
        const maxStep = speed * dt;
        const step = Math.min(maxStep, dist - 37);

        if (step > 0 && dist > 0.001) {
          pos.x += (dx / dist) * step;
          pos.y += (dy / dist) * step;
        }
      }

      // Viewport safety boundary
      pos.x = Math.max(16, Math.min(window.innerWidth - 16, pos.x));
      pos.y = Math.max(16, Math.min(window.innerHeight - 16, pos.y));

      // ==========================================
      // Exact Angle Calculation & Anti-Upside-Down Logic
      // ==========================================
      let targetAngle = 0;

      if (state !== "idle" && state !== "sleep" && dist > 1) {
        // Continuous rotation toward mouse cursor
        const rawAngleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        targetAngle = rawAngleDeg;

        // Anti-Upside-Down Logic:
        // Base sprite faces right (0deg). If cursor is to the left (|angle| > 90),
        // flip scaleY(-1) so cat remains right-side up while still pointing toward cursor.
        if (!isFlipped && Math.abs(rawAngleDeg) > 95) {
          isFlipped = true;
        } else if (isFlipped && Math.abs(rawAngleDeg) < 85) {
          isFlipped = false;
        }
      } else {
        // Sitting / Sleeping State:
        // Reset rotation tilt to 0deg (upright & flat on screen)
        // facing whichever horizontal side it last faced.
        targetAngle = isFlipped ? (currentAngle >= 0 ? 180 : -180) : 0;
      }

      // Smooth Angular Interpolation (lerping angle to eliminate snapping)
      const angleDelta = getShortestAngleDelta(currentAngle, targetAngle);
      const lerpFactor = 1 - Math.exp(-14 * dt);
      currentAngle = normalizeAngle(currentAngle + angleDelta * lerpFactor);

      // ==========================================
      // Animation Frame Timing
      // Idle (Sitting): 2 FPS
      // Sleep (Breathing): 1 FPS
      // Walk: 8 FPS
      // Run: 14 FPS
      // ==========================================
      animTimer += dt;
      let frameIndex = 0;

      if (state === "sleep") {
        frameIndex = Math.floor(animTimer * 1.2) % 2;
        setFrame(`sleep_${frameIndex}`);
      } else if (state === "idle") {
        frameIndex = Math.floor(animTimer * 2) % 2;
        setFrame(`idle_${frameIndex}`);
      } else if (state === "walk") {
        frameIndex = Math.floor(animTimer * 8) % 4;
        setFrame(`walk_${frameIndex}`);
      } else {
        frameIndex = Math.floor(animTimer * 14) % 4;
        setFrame(`run_${frameIndex}`);
      }

      // ==========================================
      // GPU Transform (Pivot around cat center 28, 17.5)
      // ==========================================
      const container = containerRef.current;
      if (container) {
        const posX = Math.round(pos.x - DISPLAY_WIDTH / 2);
        const posY = Math.round(pos.y - DISPLAY_HEIGHT / 2);
        const scaleY = isFlipped ? -1 : 1;

        container.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${currentAngle.toFixed(
          2
        )}deg) scaleY(${scaleY})`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="hidden lg:block fixed top-0 left-0 pointer-events-none select-none will-change-transform"
      style={{
        zIndex: 9999,
        width: `${DISPLAY_WIDTH}px`,
        height: `${DISPLAY_HEIGHT}px`,
        transformOrigin: `${DISPLAY_WIDTH / 2}px ${DISPLAY_HEIGHT / 2}px`,
      }}
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        {/* Floating Animated Sleep Bubble (z z Z) when sleeping */}
        <div
          ref={sleepBubbleRef}
          className="absolute -top-4 right-1 flex items-baseline font-mono font-black text-sky-400 select-none text-[11px] pointer-events-none drop-shadow-sm"
          style={{ display: "none" }}
        >
          <span className="animate-pulse">z</span>
          <span className="text-[9px] opacity-80 animate-bounce">z</span>
          <span className="text-[7.5px] opacity-60">Z</span>
        </div>

        <svg
          viewBox="0 0 80 50"
          className="w-full h-full drop-shadow-md overflow-visible select-none"
        >
          {/* =======================================================
              IDLE / SITTING FRAME 0: Alert open eyes, curled tail
              ======================================================= */}
          <g ref={idle0Ref} style={{ display: "inline" }}>
            <ellipse cx="40" cy="46" rx="22" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />

            <path
              d="M 24 40 C 14 40 10 32 12 24 C 13 18 18 19 18 23 C 18 28 20 34 26 38 Z"
              fill="#A020F0"
              stroke="#4A0E4E"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            <ellipse cx="28" cy="36" rx="10" ry="8" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <ellipse cx="28" cy="36" rx="7" ry="5.5" fill="#8B10D0" />

            <path
              d="M 28 32 C 30 22 42 22 46 32 C 48 38 46 44 42 44 C 36 44 26 42 28 32 Z"
              fill="#A020F0"
              stroke="#4A0E4E"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            <path d="M 39 28 C 45 30 46 37 42 41 C 39 42 37 36 38 30 Z" fill="#F3E8FF" />

            <rect x="38" y="38" width="5.5" height="7" rx="2.7" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="44" y="38" width="5.5" height="7" rx="2.7" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            <ellipse cx="22" cy="43" rx="4.5" ry="2.7" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />

            <ellipse cx="48" cy="20" rx="13" ry="11" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />

            <polygon points="41,13 40,3 47,9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="41.5,11 41,5 45.5,9" fill="#FF8DA1" />
            <polygon points="51,10 56,3 58,13" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="52.5,10 55.5,5 56.5,11" fill="#FF8DA1" />

            <circle cx="41" cy="23" r="2.2" fill="#FF8DA1" opacity="0.65" />
            <circle cx="56" cy="23" r="2.2" fill="#FF8DA1" opacity="0.65" />

            <ellipse cx="45" cy="18" rx="2.8" ry="3.5" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
            <ellipse cx="45.5" cy="18" rx="1.5" ry="2.2" fill="#2D0830" />
            <circle cx="44.3" cy="16.8" r="0.9" fill="#FFFFFF" />
            <ellipse cx="53" cy="18" rx="2.8" ry="3.5" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
            <ellipse cx="53.5" cy="18" rx="1.5" ry="2.2" fill="#2D0830" />
            <circle cx="52.3" cy="16.8" r="0.9" fill="#FFFFFF" />

            <ellipse cx="49" cy="22" rx="4.5" ry="3" fill="#F3E8FF" />
            <polygon points="48,21 50,21 49,22.5" fill="#FF69B4" />

            <path d="M 47.5 23 Q 48.3 24 49 23.2 Q 49.7 24 50.5 23" fill="none" stroke="#4A0E4E" strokeWidth="1.2" strokeLinecap="round" />

            <g stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round">
              <line x1="36" y1="20" x2="43" y2="21" />
              <line x1="35" y1="23" x2="43" y2="23" />
              <line x1="55" y1="21" x2="62" y2="20" />
              <line x1="55" y1="23" x2="63" y2="23" />
            </g>
          </g>

          {/* =======================================================
              IDLE / SITTING FRAME 1: Blinking happy eyes (^ ^), tail swish
              ======================================================= */}
          <g ref={idle1Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="22" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            <path
              d="M 24 39 C 12 38 8 28 10 18 C 11 12 17 13 17 17 C 17 22 20 30 26 36 Z"
              fill="#A020F0"
              stroke="#4A0E4E"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            <ellipse cx="28" cy="36" rx="10" ry="8" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <ellipse cx="28" cy="36" rx="7" ry="5.5" fill="#8B10D0" />

            <path
              d="M 28 32 C 30 22 42 22 46 32 C 48 38 46 44 42 44 C 36 44 26 42 28 32 Z"
              fill="#A020F0"
              stroke="#4A0E4E"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M 39 28 C 45 30 46 37 42 41 C 39 42 37 36 38 30 Z" fill="#F3E8FF" />

            <rect x="38" y="38" width="5.5" height="7" rx="2.7" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="44" y="38" width="5.5" height="7" rx="2.7" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            <ellipse cx="22" cy="43" rx="4.5" ry="2.7" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />

            <ellipse cx="48" cy="20" rx="13" ry="11" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />

            <polygon points="41,13 40,3 47,9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="41.5,11 41,5 45.5,9" fill="#FF8DA1" />
            <polygon points="51,10 56,3 58,13" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="52.5,10 55.5,5 56.5,11" fill="#FF8DA1" />

            <circle cx="41" cy="23" r="2.2" fill="#FF8DA1" opacity="0.65" />
            <circle cx="56" cy="23" r="2.2" fill="#FF8DA1" opacity="0.65" />

            <path d="M 43 18 Q 45.5 15 48 18" fill="none" stroke="#4A0E4E" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 51 18 Q 53.5 15 56 18" fill="none" stroke="#4A0E4E" strokeWidth="1.8" strokeLinecap="round" />

            <ellipse cx="49" cy="22" rx="4.5" ry="3" fill="#F3E8FF" />
            <polygon points="48,21 50,21 49,22.5" fill="#FF69B4" />
            <path d="M 47.5 23 Q 48.3 24 49 23.2 Q 49.7 24 50.5 23" fill="none" stroke="#4A0E4E" strokeWidth="1.2" strokeLinecap="round" />

            <g stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round">
              <line x1="36" y1="20" x2="43" y2="21" />
              <line x1="35" y1="23" x2="43" y2="23" />
              <line x1="55" y1="21" x2="62" y2="20" />
              <line x1="55" y1="23" x2="63" y2="23" />
            </g>
          </g>

          {/* =======================================================
              SLEEP FRAME 0: Curled sleeping loaf, peaceful closed eyes
              ======================================================= */}
          <g ref={sleep0Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="20" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            {/* Tail wrapped around body */}
            <path d="M 22 38 C 16 38 12 34 16 28 C 19 24 24 28 22 34 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            {/* Curled Body Loaf */}
            <ellipse cx="36" cy="35" rx="16" ry="10" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <ellipse cx="38" cy="36" rx="9" ry="6" fill="#F3E8FF" />

            {/* Head resting down */}
            <ellipse cx="48" cy="32" rx="11" ry="9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />

            {/* Relaxed Sleeping Ears */}
            <polygon points="41,26 38,18 45,23" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="41,24 39,20 44,23" fill="#FF8DA1" />
            <polygon points="49,24 53,17 56,25" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="50,24 53,19 55,24" fill="#FF8DA1" />

            <circle cx="43" cy="34" r="2" fill="#FF8DA1" opacity="0.6" />
            <circle cx="54" cy="34" r="2" fill="#FF8DA1" opacity="0.6" />

            {/* Peaceful Closed Eyes */}
            <path d="M 43 31 Q 45.5 33 48 31" fill="none" stroke="#4A0E4E" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 50 31 Q 52.5 33 55 31" fill="none" stroke="#4A0E4E" strokeWidth="1.8" strokeLinecap="round" />

            <ellipse cx="49" cy="34" rx="4" ry="2.5" fill="#F3E8FF" />
            <polygon points="48,33 50,33 49,34.2" fill="#FF69B4" />

            {/* Tucked Paws */}
            <ellipse cx="44" cy="42" rx="4.5" ry="2.8" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />
            <ellipse cx="50" cy="42" rx="4.5" ry="2.8" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />

            <g stroke="#E9D5FF" strokeWidth="1.1" strokeLinecap="round">
              <line x1="36" y1="32" x2="42" y2="33" />
              <line x1="36" y1="35" x2="42" y2="35" />
              <line x1="55" y1="33" x2="61" y2="32" />
              <line x1="55" y1="35" x2="61" y2="35" />
            </g>
          </g>

          {/* =======================================================
              SLEEP FRAME 1: Gentle breathing rise
              ======================================================= */}
          <g ref={sleep1Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="20" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            <path d="M 22 38 C 16 38 12 34 16 28 C 19 24 24 28 22 34 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <g transform="translate(0, -0.8)">
              <ellipse cx="36" cy="35" rx="16.5" ry="10.5" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
              <ellipse cx="38" cy="36" rx="9.5" ry="6.5" fill="#F3E8FF" />

              <ellipse cx="48" cy="32" rx="11" ry="9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />

              <polygon points="41,26 38,18 45,23" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" strokeLinejoin="round" />
              <polygon points="41,24 39,20 44,23" fill="#FF8DA1" />
              <polygon points="49,24 53,17 56,25" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" strokeLinejoin="round" />
              <polygon points="50,24 53,19 55,24" fill="#FF8DA1" />

              <circle cx="43" cy="34" r="2" fill="#FF8DA1" opacity="0.6" />
              <circle cx="54" cy="34" r="2" fill="#FF8DA1" opacity="0.6" />

              <path d="M 43 31 Q 45.5 33 48 31" fill="none" stroke="#4A0E4E" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 50 31 Q 52.5 33 55 31" fill="none" stroke="#4A0E4E" strokeWidth="1.8" strokeLinecap="round" />

              <ellipse cx="49" cy="34" rx="4" ry="2.5" fill="#F3E8FF" />
              <polygon points="48,33 50,33 49,34.2" fill="#FF69B4" />

              <ellipse cx="44" cy="42" rx="4.5" ry="2.8" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />
              <ellipse cx="50" cy="42" rx="4.5" ry="2.8" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />

              <g stroke="#E9D5FF" strokeWidth="1.1" strokeLinecap="round">
                <line x1="36" y1="32" x2="42" y2="33" />
                <line x1="36" y1="35" x2="42" y2="35" />
                <line x1="55" y1="33" x2="61" y2="32" />
                <line x1="55" y1="35" x2="61" y2="35" />
              </g>
            </g>
          </g>

          {/* =======================================================
              WALK FRAME 0 (Stride A: Right Front + Left Hind Forward)
              ======================================================= */}
          <g ref={walk0Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="24" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            <path d="M 20 28 C 10 24 6 16 9 10 C 12 8 14 12 14 16 C 14 20 18 24 22 26 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <g transform="translate(4, 0)">
              <path d="M 24 28 L 22 41 L 26 41 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="22" y="39" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>
            <g transform="translate(-3, 0)">
              <path d="M 46 28 L 45 41 L 49 41 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="44.5" y="39" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>

            <path d="M 22 28 C 22 20 34 18 50 22 C 54 26 52 35 46 36 C 34 36 22 34 22 28 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 32 30 C 40 30 48 31 50 26 C 51 32 46 35 38 35 C 32 35 30 32 32 30 Z" fill="#F3E8FF" />

            <ellipse cx="53" cy="19" rx="12" ry="10.5" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <polygon points="46,12 45,3 52,9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="46.5,10 46,5 50.5,9" fill="#FF8DA1" />
            <polygon points="55,9 60,3 62,12" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="56.5,9 59.5,5 60.5,11" fill="#FF8DA1" />

            <ellipse cx="52" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
            <ellipse cx="52.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
            <circle cx="51.5" cy="15.8" r="0.8" fill="#FFFFFF" />
            <ellipse cx="59" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
            <ellipse cx="59.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
            <circle cx="58.5" cy="15.8" r="0.8" fill="#FFFFFF" />

            <polygon points="56,20 58,20 57,21.5" fill="#FF69B4" />
            <path d="M 55.5 22 Q 56.3 22.8 57 22 Q 57.7 22.8 58.5 22" fill="none" stroke="#4A0E4E" strokeWidth="1.2" strokeLinecap="round" />

            <g stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round">
              <line x1="43" y1="19" x2="49" y2="20" />
              <line x1="42" y1="22" x2="49" y2="22" />
              <line x1="60" y1="20" x2="67" y2="19" />
              <line x1="60" y1="22" x2="68" y2="22" />
            </g>

            <g transform="translate(-5, 0)">
              <ellipse cx="26" cy="30" rx="6" ry="7" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="23.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
            <g transform="translate(5, 0)">
              <path d="M 48 26 L 47 39 L 52 39 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="46.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
          </g>

          {/* =======================================================
              WALK FRAME 1 (Passing Phase A: Lift & Cross)
              ======================================================= */}
          <g ref={walk1Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="24" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            <path d="M 20 28 C 10 24 6 14 9 8 C 12 6 14 10 14 14 C 14 18 18 24 22 26 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <g transform="translate(1, 0)">
              <path d="M 24 28 L 22 40 L 26 40 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="22" y="38" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>
            <g transform="translate(0, 0)">
              <path d="M 46 28 L 45 40 L 49 40 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="44.5" y="38" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>

            <g transform="translate(0, -1.5)">
              <path d="M 22 28 C 22 20 34 18 50 22 C 54 26 52 35 46 36 C 34 36 22 34 22 28 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
              <path d="M 32 30 C 40 30 48 31 50 26 C 51 32 46 35 38 35 C 32 35 30 32 32 30 Z" fill="#F3E8FF" />

              <ellipse cx="53" cy="19" rx="12" ry="10.5" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
              <polygon points="46,12 45,3 52,9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
              <polygon points="46.5,10 46,5 50.5,9" fill="#FF8DA1" />
              <polygon points="55,9 60,3 62,12" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
              <polygon points="56.5,9 59.5,5 60.5,11" fill="#FF8DA1" />

              <ellipse cx="52" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
              <ellipse cx="52.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
              <circle cx="51.5" cy="15.8" r="0.8" fill="#FFFFFF" />
              <ellipse cx="59" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
              <ellipse cx="59.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
              <circle cx="58.5" cy="15.8" r="0.8" fill="#FFFFFF" />

              <polygon points="56,20 58,20 57,21.5" fill="#FF69B4" />
              <path d="M 55.5 22 Q 56.3 22.8 57 22 Q 57.7 22.8 58.5 22" fill="none" stroke="#4A0E4E" strokeWidth="1.2" strokeLinecap="round" />

              <g stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round">
                <line x1="43" y1="19" x2="49" y2="20" />
                <line x1="42" y1="22" x2="49" y2="22" />
                <line x1="60" y1="20" x2="67" y2="19" />
                <line x1="60" y1="22" x2="68" y2="22" />
              </g>
            </g>

            <g transform="translate(-1, 0)">
              <ellipse cx="26" cy="30" rx="6" ry="7" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="23.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
            <g transform="translate(1, 0)">
              <path d="M 48 26 L 47 39 L 52 39 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="46.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
          </g>

          {/* =======================================================
              WALK FRAME 2 (Stride B: Left Front + Right Hind Forward)
              ======================================================= */}
          <g ref={walk2Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="24" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            <path d="M 20 28 C 10 24 6 16 9 10 C 12 8 14 12 14 16 C 14 20 18 24 22 26 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <g transform="translate(-5, 0)">
              <path d="M 24 28 L 22 41 L 26 41 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="22" y="39" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>
            <g transform="translate(5, 0)">
              <path d="M 46 28 L 45 41 L 49 41 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="44.5" y="39" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>

            <path d="M 22 28 C 22 20 34 18 50 22 C 54 26 52 35 46 36 C 34 36 22 34 22 28 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 32 30 C 40 30 48 31 50 26 C 51 32 46 35 38 35 C 32 35 30 32 32 30 Z" fill="#F3E8FF" />

            <ellipse cx="53" cy="19" rx="12" ry="10.5" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <polygon points="46,12 45,3 52,9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="46.5,10 46,5 50.5,9" fill="#FF8DA1" />
            <polygon points="55,9 60,3 62,12" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="56.5,9 59.5,5 60.5,11" fill="#FF8DA1" />

            <ellipse cx="52" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
            <ellipse cx="52.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
            <circle cx="51.5" cy="15.8" r="0.8" fill="#FFFFFF" />
            <ellipse cx="59" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
            <ellipse cx="59.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
            <circle cx="58.5" cy="15.8" r="0.8" fill="#FFFFFF" />

            <polygon points="56,20 58,20 57,21.5" fill="#FF69B4" />
            <path d="M 55.5 22 Q 56.3 22.8 57 22 Q 57.7 22.8 58.5 22" fill="none" stroke="#4A0E4E" strokeWidth="1.2" strokeLinecap="round" />

            <g stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round">
              <line x1="43" y1="19" x2="49" y2="20" />
              <line x1="42" y1="22" x2="49" y2="22" />
              <line x1="60" y1="20" x2="67" y2="19" />
              <line x1="60" y1="22" x2="68" y2="22" />
            </g>

            <g transform="translate(4, 0)">
              <ellipse cx="26" cy="30" rx="6" ry="7" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="23.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
            <g transform="translate(-3, 0)">
              <path d="M 48 26 L 47 39 L 52 39 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="46.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
          </g>

          {/* =======================================================
              WALK FRAME 3 (Passing Phase B: Opposite Lift)
              ======================================================= */}
          <g ref={walk3Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="24" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            <path d="M 20 28 C 10 24 6 18 9 12 C 12 10 14 14 14 18 C 14 22 18 24 22 26 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <g transform="translate(-1, 0)">
              <path d="M 24 28 L 22 40 L 26 40 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="22" y="38" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>
            <g transform="translate(1, 0)">
              <path d="M 46 28 L 45 40 L 49 40 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="44.5" y="38" width="5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            </g>

            <g transform="translate(0, -1.5)">
              <path d="M 22 28 C 22 20 34 18 50 22 C 54 26 52 35 46 36 C 34 36 22 34 22 28 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
              <path d="M 32 30 C 40 30 48 31 50 26 C 51 32 46 35 38 35 C 32 35 30 32 32 30 Z" fill="#F3E8FF" />

              <ellipse cx="53" cy="19" rx="12" ry="10.5" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
              <polygon points="46,12 45,3 52,9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
              <polygon points="46.5,10 46,5 50.5,9" fill="#FF8DA1" />
              <polygon points="55,9 60,3 62,12" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
              <polygon points="56.5,9 59.5,5 60.5,11" fill="#FF8DA1" />

              <ellipse cx="52" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
              <ellipse cx="52.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
              <circle cx="51.5" cy="15.8" r="0.8" fill="#FFFFFF" />
              <ellipse cx="59" cy="17" rx="2.7" ry="3.3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.5" />
              <ellipse cx="59.6" cy="17" rx="1.4" ry="2.1" fill="#2D0830" />
              <circle cx="58.5" cy="15.8" r="0.8" fill="#FFFFFF" />

              <polygon points="56,20 58,20 57,21.5" fill="#FF69B4" />
              <path d="M 55.5 22 Q 56.3 22.8 57 22 Q 57.7 22.8 58.5 22" fill="none" stroke="#4A0E4E" strokeWidth="1.2" strokeLinecap="round" />

              <g stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round">
                <line x1="43" y1="19" x2="49" y2="20" />
                <line x1="42" y1="22" x2="49" y2="22" />
                <line x1="60" y1="20" x2="67" y2="19" />
                <line x1="60" y1="22" x2="68" y2="22" />
              </g>
            </g>

            <g transform="translate(1, 0)">
              <ellipse cx="26" cy="30" rx="6" ry="7" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="23.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
            <g transform="translate(0, 0)">
              <path d="M 48 26 L 47 39 L 52 39 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
              <rect x="46.5" y="38" width="5.5" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.8" />
            </g>
          </g>

          {/* =======================================================
              RUN FRAME 0: Full Extension Leap (Airborne Stretch)
              ======================================================= */}
          <g ref={run0Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="28" ry="2.8" fill="rgba(74, 14, 78, 0.14)" />
            <path d="M 18 20 C 8 20 4 17 2 15 C 3 13 8 15 12 17 C 15 18 18 19 22 19 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <path d="M 22 23 L 8 26 L 10 29 L 24 26 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="7" y="25" width="5" height="4" rx="2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            <path d="M 24 21 L 11 23 L 13 26 L 26 23 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="10" y="22" width="5" height="4" rx="2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />

            <path d="M 20 22 C 22 16 38 14 56 18 C 60 21 58 29 50 30 C 36 30 20 28 20 22 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 32 25 C 42 25 50 26 52 21 C 53 26 48 29 40 29 C 32 29 30 27 32 25 Z" fill="#F3E8FF" />

            <ellipse cx="56" cy="18" rx="11" ry="9.5" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <polygon points="48,13 42,7 50,9" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="48,11 43,8 48,10" fill="#FF8DA1" />
            <polygon points="53,10 49,4 56,8" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" strokeLinejoin="round" />

            <ellipse cx="56" cy="16" rx="2.5" ry="3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.4" />
            <ellipse cx="56.7" cy="16" rx="1.3" ry="1.9" fill="#2D0830" />
            <circle cx="55.8" cy="15" r="0.7" fill="#FFFFFF" />
            <polygon points="60,19 62,19 61,20.3" fill="#FF69B4" />

            <g stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round">
              <line x1="47" y1="18" x2="53" y2="19" />
              <line x1="62" y1="19" x2="69" y2="18" />
              <line x1="61" y1="21" x2="70" y2="21" />
            </g>

            <path d="M 52 24 L 68 25 L 68 28 L 50 28 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="66" y="24" width="6" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            <path d="M 50 22 L 72 22 L 72 25 L 48 26 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="70" y="21" width="6" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
          </g>

          {/* =======================================================
              RUN FRAME 1: Front Landing Impact
              ======================================================= */}
          <g ref={run1Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="25" ry="3.5" fill="rgba(74, 14, 78, 0.2)" />
            <path d="M 18 24 C 8 20 4 11 8 6 C 11 5 13 8 13 12 C 13 16 16 22 20 23 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <path d="M 22 26 L 16 35 L 20 35 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="16" y="33" width="5" height="4" rx="2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />

            <path d="M 20 24 C 22 17 36 17 52 23 C 55 28 52 36 44 36 C 30 36 20 32 20 24 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />

            <ellipse cx="54" cy="22" rx="11" ry="10" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <polygon points="46,14 44,5 51,10" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <polygon points="54,11 57,4 61,13" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />

            <ellipse cx="53" cy="20" rx="2.5" ry="3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.4" />
            <ellipse cx="53.6" cy="20" rx="1.3" ry="1.9" fill="#2D0830" />
            <polygon points="58,23 60,23 59,24.3" fill="#FF69B4" />

            <path d="M 46 29 L 48 42 L 53 42 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="48" y="40" width="5.5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            <path d="M 48 27 L 54 41 L 59 41 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="54" y="39" width="5.5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
          </g>

          {/* =======================================================
              RUN FRAME 2: Gathered Compact Coil (Coiled Spring)
              ======================================================= */}
          <g ref={run2Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="22" ry="3.5" fill="rgba(74, 14, 78, 0.22)" />
            <path d="M 22 23 C 12 18 8 9 12 5 C 15 4 17 8 17 12 C 17 16 20 20 24 22 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <path d="M 22 25 C 22 14 36 12 48 18 C 52 23 50 32 44 33 C 34 33 22 34 22 25 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />

            <ellipse cx="52" cy="18" rx="11" ry="10" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <polygon points="44,11 42,2 49,8" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <polygon points="53,9 57,2 60,11" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />

            <ellipse cx="51" cy="16" rx="2.5" ry="3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.4" />
            <ellipse cx="51.6" cy="16" rx="1.3" ry="1.9" fill="#2D0830" />
            <polygon points="56,19 58,19 57,20.3" fill="#FF69B4" />

            <rect x="28" y="32" width="5.5" height="6.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />
            <rect x="33" y="31" width="5.5" height="6.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />
            <rect x="39" y="32" width="5.5" height="6.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />
            <rect x="44" y="33" width="5.5" height="6.5" rx="2.5" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.6" />
          </g>

          {/* =======================================================
              RUN FRAME 3: Rear Propulsion Thrust (Hard Kick & Launch)
              ======================================================= */}
          <g ref={run3Ref} style={{ display: "none" }}>
            <ellipse cx="40" cy="46" rx="26" ry="3.5" fill="rgba(74, 14, 78, 0.2)" />
            <path d="M 22 25 C 12 25 6 22 3 19 C 4 17 8 19 12 21 C 16 22 19 24 24 24 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" strokeLinejoin="round" />

            <path d="M 26 27 L 14 38 L 19 39 L 28 30 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="13" y="37" width="6" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            <path d="M 28 25 L 18 39 L 23 40 L 30 28 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="18" y="38" width="6" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />

            <path d="M 26 26 C 26 18 38 15 54 19 C 58 24 55 32 48 33 C 36 33 26 33 26 26 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />

            <ellipse cx="55" cy="18" rx="11" ry="9.5" fill="#A020F0" stroke="#4A0E4E" strokeWidth="2" />
            <polygon points="47,12 43,4 50,8" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <polygon points="54,9 56,3 61,11" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />

            <ellipse cx="54" cy="16" rx="2.5" ry="3" fill="#22D3EE" stroke="#4A0E4E" strokeWidth="1.4" />
            <ellipse cx="54.6" cy="16" rx="1.3" ry="1.9" fill="#2D0830" />
            <polygon points="59,19 61,19 60,20.3" fill="#FF69B4" />

            <path d="M 48 26 L 62 20 L 64 23 L 48 29 Z" fill="#8B10D0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="61" y="19" width="5.5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
            <path d="M 46 25 L 66 18 L 68 21 L 46 28 Z" fill="#A020F0" stroke="#4A0E4E" strokeWidth="1.8" />
            <rect x="65" y="17" width="5.5" height="4.5" rx="2.2" fill="#FFFFFF" stroke="#4A0E4E" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
