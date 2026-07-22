"use client";

import * as React from "react";
import { Terminal, Sun, Moon, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "About",     href: "#hero" },
  { label: "Education", href: "#education" },
  { label: "CP",        href: "#achievements" },
  { label: "GitHub",    href: "#github" },
  { label: "Projects",  href: "#projects" },
  { label: "Contact",   href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("#hero");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Active section tracking
      const sections = navLinks.map(l => l.href.substring(1));
      let current = activeSection;
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = "#" + id;
          }
        }
      }
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeSection]);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className={cn(
          "w-full max-w-3xl h-12 flex items-center justify-between px-6 rounded-full border transition-all duration-300 shadow-sm",
          scrolled
            ? "bg-background/70 backdrop-blur-md border-border/40 shadow-black/10"
            : "bg-background/20 backdrop-blur-sm border-border/20"
        )}
      >
        {/* Logo (Home Icon) */}
        <a 
          href="#hero" 
          className="flex items-center justify-center p-2 rounded-full bg-primary/5 hover:bg-primary/15 border border-primary/10 text-primary transition-all group shrink-0"
          aria-label="Home"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </a>

        {/* Right Nav Container */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Nav Links */}
          <nav className="flex items-center gap-3 sm:gap-5">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "text-xs sm:text-sm font-mono font-semibold transition-all",
                  activeSection === link.href 
                    ? "text-primary border-b border-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-full hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground shrink-0 border border-border/20 hover:border-border/60 flex items-center justify-center h-7 w-7"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-sky-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
