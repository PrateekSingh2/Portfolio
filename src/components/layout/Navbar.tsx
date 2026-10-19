"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, FolderKanban, Mail, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const navLinks = [
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderKanban className="w-3.5 h-3.5" />,
  },
  {
    label: "Blog",
    href: "/blog",
    icon: <BookOpen className="w-3.5 h-3.5" />,
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
  const [isSwitching, setIsSwitching] = React.useState(false);
  const navContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile hamburger menu when clicking or tapping outside
  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleToggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSwitching) return;
    const nextTheme = theme === "dark" ? "light" : "dark";
    setIsSwitching(true);
    setTimeout(() => setIsSwitching(false), 700);

    // View Transitions API for eye-catching full-screen expanding circular ripple
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX || buttonRect.left + buttonRect.width / 2;
      const y = e.clientY || buttonRect.top + buttonRect.height / 2;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transition = (document as any).startViewTransition(async () => {
        setTheme(nextTheme);
        await new Promise((resolve) => setTimeout(resolve, 25));
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 700,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          setTheme(nextTheme);
        });
    } else {
      setTheme(nextTheme);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay - closes mobile menu when tapping anywhere outside */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/15 dark:bg-black/35 backdrop-blur-[2px] md:hidden pointer-events-auto animate-in fade-in-0 duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header
        ref={navContainerRef}
        className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none"
      >
      <div
        className={cn(
          "w-full max-w-3xl h-12 flex items-center justify-between px-4 sm:px-6 rounded-full border transition-all duration-300 pointer-events-auto backdrop-blur-xl",
          scrolled || mobileMenuOpen
            ? "bg-white/35 dark:bg-[#0c1017]/45 border-black/[0.04] dark:border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_35px_rgba(0,0,0,0.4)]"
            : "bg-white/20 dark:bg-[#0c1017]/30 border-black/[0.03] dark:border-white/[0.03] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Brand Name (Clickable Home Navigation) */}
        <Link
          href="/"
          className="group flex items-center shrink-0 py-0.5 px-1.5 -ml-1 rounded-lg transition-transform duration-200 hover:scale-[1.04] active:scale-95"
          aria-label="Prateek Singh - Navigate to Home"
          title="Prateek Singh - Home"
        >
          <span className="font-[family-name:var(--font-caveat)] text-[22px] sm:text-[25px] font-bold tracking-tight leading-none transition-all duration-300 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-sky-400 dark:via-cyan-300 dark:to-teal-300 bg-clip-text text-transparent drop-shadow-xs dark:drop-shadow-[0_0_12px_rgba(56,189,248,0.45)] group-hover:opacity-90">
            Prateek Singh
          </span>
        </Link>

        {/* Desktop External Routes */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-mono transition-all py-1 border-b-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 duration-150",
                  isActive
                    ? "text-primary border-primary font-bold"
                    : "text-muted-foreground hover:text-foreground border-transparent font-semibold"
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
            onClick={handleToggleTheme}
            className="p-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] backdrop-blur-md transition-all duration-300 text-muted-foreground hover:text-foreground shrink-0 border border-black/5 dark:border-white/10 flex items-center justify-center h-8 w-8 cursor-pointer shadow-sm active:scale-90"
            aria-label="Toggle theme"
            title={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
            suppressHydrationWarning
          >
            {!mounted ? (
              <span className="h-4 w-4 block" aria-hidden="true" />
            ) : theme === "dark" ? (
              <Sun
                className={cn(
                  "h-4 w-4 text-amber-400",
                  isSwitching ? "theme-icon-transition" : "animate-pulse"
                )}
              />
            ) : (
              <Moon
                className={cn(
                  "h-4 w-4 text-indigo-600 dark:text-sky-400",
                  isSwitching && "theme-icon-transition"
                )}
              />
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] transition-colors text-muted-foreground hover:text-foreground shrink-0 border border-black/5 dark:border-white/10 flex items-center justify-center h-8 w-8 cursor-pointer active:scale-90"
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
        <div className="w-full max-w-3xl mt-2 p-3 rounded-2xl bg-white/35 dark:bg-[#0c1017]/45 backdrop-blur-2xl border border-black/[0.04] dark:border-white/[0.05] shadow-xl md:hidden pointer-events-auto space-y-1 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="grid grid-cols-3 gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex flex-col sm:flex-row items-center justify-center gap-1.5 px-2 py-2 rounded-xl font-mono text-[11px] font-semibold transition-all border cursor-pointer text-center",
                    isActive
                      ? "bg-primary/10 text-primary border-primary/30 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent"
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
    </>
  );
}
