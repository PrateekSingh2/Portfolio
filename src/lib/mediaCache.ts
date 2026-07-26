"use client";

const imageCache = new Set<string>();

/**
 * Preloads a single image or SVG icon into browser cache
 */
export function preloadImage(src: string) {
  if (!src || typeof window === "undefined" || imageCache.has(src)) return;
  const img = new Image();
  img.src = src;
  imageCache.add(src);
}

/**
 * Preloads an array of image or SVG URLs into browser cache
 */
export function preloadImages(srcs: string[]) {
  if (typeof window === "undefined") return;
  srcs.forEach((src) => {
    if (src) preloadImage(src);
  });
}
