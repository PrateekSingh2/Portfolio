"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sun, Moon, Menu, X, FolderKanban, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Home", href: "/", icon: <Home className="w-3.5 h-3.5" /> },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderKanban className="w-3.5 h-3.5" />,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <Mail className="w-3.5 h-3.5" />,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
      <div
        className={cn(
          "w-full max-w-3xl h-12 flex items-center justify-between px-4 sm:px-6 rounded-full border transition-all duration-300 shadow-sm pointer-events-auto backdrop-blur-xl",
          scrolled || mobileMenuOpen
            ? "bg-background/35 border-border/40 shadow-lg shadow-black/5"
            : "bg-background/20 border-border/20 shadow-none",
        )}
      >
        {/* Logo (Home Icon Link) */}
        <Link
          href="/"
          className="flex items-center justify-center p-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all group shrink-0"
          aria-label="Home"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </Link>

        {/* Desktop External Routes */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-mono font-semibold transition-all py-1 border-b-2 cursor-pointer",
                  isActive
                    ? "text-primary border-primary font-bold"
                    : "text-muted-foreground hover:text-primary border-transparent",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-full hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground shrink-0 border border-border/20 hover:border-border/60 flex items-center justify-center h-8 w-8 cursor-pointer"
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
            className="md:hidden p-1.5 rounded-full hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground shrink-0 border border-border/20 flex items-center justify-center h-8 w-8 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 text-primary" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="w-full max-w-3xl mt-2 p-3 rounded-2xl bg-background/40 backdrop-blur-xl border border-border/40 shadow-2xl md:hidden pointer-events-auto space-y-1 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="grid grid-cols-3 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all border cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary border-primary/30 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-transparent",
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
