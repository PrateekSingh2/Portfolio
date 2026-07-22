"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      angleOffset: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // Natural drift speed
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.size = this.baseSize;
        this.angleOffset = Math.random() * Math.PI * 2;
      }

      update(w: number, h: number) {
        // Apply normal physics drift
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off boundaries with damping
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > w) { this.x = w; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > h) { this.y = h; this.vy *= -1; }

        // Friction to damp excessive speed from orbit forces
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Add tiny random walk drift so particles don't freeze
        this.vx += (Math.random() - 0.5) * 0.05;
        this.vy += (Math.random() - 0.5) * 0.05;

        // Swirling Gravitational Black Hole / Vortex Effect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius; // Stronger force closer to cursor
            
            // 1. Radial pull (pull particles directly into the cursor)
            const pullForce = force * 0.28;
            this.vx += (dx / distance) * pullForce;
            this.vy += (dy / distance) * pullForce;

            // 2. Swirling orbit force (perpendicular to pull direction)
            const orbitSpeed = force * 0.65;
            this.vx += (-dy / distance) * orbitSpeed;
            this.vy += (dx / distance) * orbitSpeed;

            // Grow particles near the core
            this.size = this.baseSize * (1 + force * 2);
          } else {
            this.size = this.baseSize;
          }
        } else {
          this.size = this.baseSize;
        }
      }

      draw(c: CanvasRenderingContext2D, color: string) {
        c.fillStyle = color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 16000);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    init();

    // Determine colors based on active theme
    const isDark = theme === "dark";
    const particleColor = isDark ? "rgba(245, 158, 11, 0.2)" : "rgba(37, 99, 235, 0.1)"; // Amber in dark mode, Blue in light mode
    const lineColor = isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(37, 99, 235, 0.04)";

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(w, h);
        particles[i].draw(ctx, particleColor);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.65 * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20 w-full h-full"
    />
  );
}
