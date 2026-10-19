"use client";

import * as React from "react";

/**
 * Global visit tracking component.
 * Automatically records a visit on any entry route (direct blog links, projects, etc.)
 * even if the user exits before visiting the home page.
 * Deduplicates per browser session using sessionStorage.
 */
export function VisitTracker() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const hasVisited = sessionStorage.getItem("portfolio_visited");
      if (!hasVisited) {
        sessionStorage.setItem("portfolio_visited", "true");
        fetch("/api/visits", { method: "POST" }).catch(() => {
          // Gracefully handle offline or network error
        });
      }
    } catch {
      // Ignore storage access errors in restricted iframe environments
    }
  }, []);

  return null;
}
