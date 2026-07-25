"use client";

import * as React from "react";
import { Terminal, Sun, Moon, Home, Menu, X, Code2, GitBranch, FolderKanban, GraduationCap, Mail, User, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "About",     href: "#hero",         icon: <User className="w-3.5 h-3.5" /> },
  { label: "CP",        href: "#achievements", icon: <Code2 className="w-3.5 h-3.5" /> },
  { label: "Certs",     href: "#certifications", icon: <Award className="w-3.5 h-3.5" /> },
  { label: "GitHub",    href: "#github",       icon: <GitBranch className="w-3.5 h-3.5" /> },
  { label: "Projects",  href: "#projects",     icon: <FolderKanban className="w-3.5 h-3.5" /> },
  { label: "Contact",   href: "#contact",      icon: <Mail className="w-3.5 h-3.5" /> },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("#hero");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setActiveSection(href);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
      <div
        className={cn(
          "w-full max-w-3xl h-12 flex items-center justify-between px-4 sm:px-6 rounded-full border transition-all duration-300 shadow-sm pointer-events-auto",
          scrolled || mobileMenuOpen
            ? "bg-background/85 backdrop-blur-md border-border/50 shadow-lg"
            : "bg-background/30 backdrop-blur-sm border-border/30"
        )}
      >
        {/* Logo (Home Icon) */}
        <a 
          href="#hero" 
          onClick={() => handleNavClick("#hero")}
          className="flex items-center justify-center p-2 rounded-full bg-primary/5 hover:bg-primary/15 border border-primary/10 text-primary transition-all group shrink-0"
          aria-label="Home"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className={cn(
                "text-xs font-mono font-semibold transition-all py-1 border-b-2",
                activeSection === link.href 
                  ? "text-primary border-primary font-bold" 
                  : "text-muted-foreground hover:text-primary border-transparent"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-full hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground shrink-0 border border-border/20 hover:border-border/60 flex items-center justify-center h-8 w-8"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-sky-400" />
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground shrink-0 border border-border/20 flex items-center justify-center h-8 w-8"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4 text-primary" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="w-full max-w-3xl mt-2 p-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl md:hidden pointer-events-auto space-y-1 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all border",
                  activeSection === link.href
                    ? "bg-primary/10 text-primary border-primary/30 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-transparent"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
