"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return; // Disable on touch/mobile or when reduced motion requested

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: SparkParticle[] = [];
    const mouse = { x: -100, y: -100, lastX: -100, lastY: -100, speed: 0, scale: 1 };
    
    const GLYPHS = ["0", "1", "<", ">", "{", "}", "+", "-", "/", "*", ";", "[", "]", "cp", "ai", "dev"];

    class SparkParticle {
      x: number;
      y: number;
      char: string;
      vx: number;
      vy: number;
      alpha: number;
      scale: number;
      rotation: number;
      rotSpeed: number;
      isExplosion: boolean;
      gravity: number;

      constructor(x: number, y: number, isExplosion = false) {
        this.x = x;
        this.y = y;
        this.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        this.isExplosion = isExplosion;
        
        const angle = Math.random() * Math.PI * 2;
        if (isExplosion) {
          // Speed burst in 360 degrees for click shockwaves
          const speed = Math.random() * 3.5 + 1.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.gravity = 0.08; // Spark firework gravity drop
          this.scale = Math.random() * 0.5 + 0.9;
          this.alpha = 1.0;
        } else {
          // Normal drag motion trail
          const speed = Math.random() * 1.2 + 0.4;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed - 0.3; // Slight upward drift
          this.gravity = 0;
          this.scale = Math.random() * 0.3 + 0.6;
          this.alpha = 0.8;
        }

        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.08;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.isExplosion) {
          this.vy += this.gravity; // Apply gravity drop
          this.vx *= 0.98; // Air resistance friction
          this.vy *= 0.98;
          this.alpha -= 0.016; // Fade out slightly quicker
        } else {
          this.alpha -= 0.012; // Natural drag fade
        }
        
        this.rotation += this.rotSpeed;
        this.scale -= 0.004;
      }

      draw(c: CanvasRenderingContext2D, color: string) {
        if (this.alpha <= 0 || this.scale <= 0) return;
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = this.alpha;
        
        c.font = `bold ${Math.floor(11 * this.scale)}px monospace`;
        c.fillStyle = color;
        c.shadowColor = color;
        c.shadowBlur = this.isExplosion ? 12 : 6;
        c.fillText(this.char, -4, 4);
        
        c.restore();
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      mouse.speed = Math.hypot(dx, dy);

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Spawn dragging spark trail
      if (mouse.speed > 2) {
        const count = Math.min(Math.floor(mouse.speed / 4.5), 3);
        for (let i = 0; i < count; i++) {
          const ratio = i / count;
          const spawnX = mouse.lastX + dx * ratio;
          const spawnY = mouse.lastY + dy * ratio;
          particles.push(new SparkParticle(spawnX, spawnY, false));
        }
      }
    };

    const handleMouseDown = () => {
      mouse.scale = 0.55;
      
      // TRIGGER THE WOW FACTOR SHOCKWAVE EXPLOSION!
      const burstCount = Math.floor(Math.random() * 8) + 18; // 18 to 25 code glyph particles
      for (let i = 0; i < burstCount; i++) {
        particles.push(new SparkParticle(mouse.x, mouse.y, true));
      }
    };

    const handleMouseUp = () => {
      mouse.scale = 1.0;
    };

    const handleMouseLeave = () => {
      mouse.x = -100;
      mouse.y = -100;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    handleResize();

    // Thematic Color Matching (Sky Cyan for dark mode, Electric Indigo Blue for light theme)
    const activeColor = theme === "dark" 
      ? "#38bdf8"  // Sky Cyan
      : "#3b82f6"; // Vibrant Indigo Blue

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth decay for cursor circle scaling
      mouse.scale += (1.0 - mouse.scale) * 0.12;

      // 1. Draw glowing core pointer dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 7 * mouse.scale, 0, Math.PI * 2);
      ctx.fillStyle = activeColor;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // 2. Draw outer boundary echo ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 16 * mouse.scale, 0, Math.PI * 2);
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.restore();

      // 3. Draw active trailing + exploding particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx, activeColor);
        if (p.alpha <= 0 || p.scale <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] w-full h-full"
    />
  );
}
