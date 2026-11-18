"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  X,
  Maximize2,
  Minimize2,
  Minus,
  Copy,
  Check,
  CornerDownLeft,
} from "lucide-react";
import { useTheme } from "next-themes";
import { PROJECTS_DATA } from "@/lib/projectsData";
import { ActivePing, ActiveCurl, ActiveMatrix } from "./TerminalActiveWidgets";

interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const COMMAND_LIST = [
  "help",
  "about",
  "whoami",
  "projects",
  "skills",
  "cp",
  "experience",
  "education",
  "contact",
  "resume",
  "blogs",
  "ls",
  "cat",
  "pwd",
  "date",
  "uptime",
  "git",
  "top",
  "ping",
  "curl",
  "history",
  "echo",
  "quote",
  "matrix",
  "theme",
  "neofetch",
  "clear",
  "exit",
];

const SUGGESTION_POOL = [
  "help",
  "about",
  "whoami",
  "projects",
  "projects schema-ai",
  "projects algolib",
  "skills",
  "cp",
  "experience",
  "education",
  "contact",
  "resume",
  "blogs",
  "ls",
  "ls -la",
  "cat README.md",
  "cat about.txt",
  "cat resume.pdf",
  "cat contact.sh",
  "pwd",
  "date",
  "uptime",
  "git status",
  "git log",
  "top",
  "ping prateekdev.me",
  "curl https://prateekdev.me/api",
  "history",
  "quote",
  "matrix",
  "theme",
  "theme dark",
  "theme light",
  "theme toggle",
  "neofetch",
  "clear",
  "exit",
  "sudo rm -rf /",
];

// Continuously updating live clock for the terminal login banner with ticking seconds
function LiveLoginClock() {
  const [timeStr, setTimeStr] = React.useState<string>("");

  React.useEffect(() => {
    const formatNow = () => {
      const now = new Date();
      return now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    const timer = setInterval(() => {
      setTimeStr(formatNow());
    }, 1000);

    const initTimer = setTimeout(() => {
      setTimeStr(formatNow());
    }, 0);

    return () => {
      clearInterval(timer);
      clearTimeout(initTimer);
    };
  }, []);

  return (
    <span suppressHydrationWarning className="tabular-nums font-mono">
      {timeStr}
    </span>
  );
}

function WelcomeBanner({
  onRunCommand,
}: {
  onRunCommand: (cmd: string) => void;
}) {
  return (
    <div className="space-y-2 select-none font-mono">
      <div className="text-white/40 text-[11px]">
        Last login: <LiveLoginClock /> on ttys002
      </div>
      <pre className="text-emerald-400 font-bold text-[10px] sm:text-xs leading-none whitespace-pre overflow-x-auto py-1">
        {` ____  ____     _  _____ _____ _____ _  __
|  _ \\|  _ \\   / \\|_   _| ____| ____| |/ /
| |_) | |_) | / _ \\ | | |  _| |  _| | ' / 
|  __/|  _ < / ___ \\| | | |___| |___| . \\ 
|_|   |_| \\_/_/   \\_\\_| |_____|_____|_|\\_\\
 ____ ___ _   _  ____ _   _ 
/ ___|_ _| \\ | |/ ___| | | |
\\___ \\| ||  \\| | |  _| |_| |
 ___) | || |\\  | |_| |  _  |
|____/___|_| \\_|\\____|_| |_|`}
      </pre>
      <div className="text-white/50 text-[11px] pt-0.5 flex flex-wrap items-center gap-1.5">
        <span>Try:</span>
        <button
          type="button"
          onClick={() => onRunCommand("about")}
          className="text-amber-300 font-semibold hover:underline cursor-pointer"
        >
          &apos;about&apos;
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => onRunCommand("projects")}
          className="text-amber-300 font-semibold hover:underline cursor-pointer"
        >
          &apos;projects&apos;
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => onRunCommand("ls -la")}
          className="text-amber-300 font-semibold hover:underline cursor-pointer"
        >
          &apos;ls&apos;
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => onRunCommand("help")}
          className="text-sky-300 font-semibold hover:underline cursor-pointer"
        >
          &apos;help&apos;
        </button>
        <span className="text-white/30 hidden sm:inline">
          (Press <kbd className="text-white/70">Tab</kbd> or{" "}
          <kbd className="text-white/70">→</kbd> to autocomplete)
        </span>
      </div>
    </div>
  );
}

export function DeveloperTerminal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [inputVal, setInputVal] = React.useState("");
  const [showBanner, setShowBanner] = React.useState(true);
  const [history, setHistory] = React.useState<CommandOutput[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);
  const [commandHistory, setCommandHistory] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState(false);

  const { theme, setTheme } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Compute zsh-style autosuggestion based on typed input
  const activeSuggestion = React.useMemo(() => {
    if (!inputVal) return "";
    const q = inputVal.toLowerCase();

    // Check command history first
    const fromHistory = [...commandHistory]
      .reverse()
      .find(
        (cmd) => cmd.toLowerCase().startsWith(q) && cmd.toLowerCase() !== q,
      );
    if (fromHistory) return fromHistory;

    // Check built-in command pool
    const fromPool = SUGGESTION_POOL.find(
      (cmd) => cmd.toLowerCase().startsWith(q) && cmd.toLowerCase() !== q,
    );
    return fromPool || "";
  }, [inputVal, commandHistory]);

  // Global backtick/tilde (`) or (~) listener to toggle terminal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.key === "`" || e.key === "~") && (!isInput || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setIsMinimized(false);
            return true;
          }
          return false;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto focus input when terminal opens or un-minimizes
  React.useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, isMinimized]);

  // Auto scroll to bottom when output updates
  React.useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen, isMinimized]);

  const handleCopyLogs = () => {
    const text = history
      .map((h) => (h.command ? `$ ${h.command}` : ""))
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    const parts = trimmed.split(" ").filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = null;

    switch (cmd) {
      case "help": {
        output = (
          <div className="space-y-3 text-xs font-mono">
            <div className="text-sky-400 font-semibold flex items-center justify-between border-b border-white/10 pb-1">
              <span>Terminal Command Manual</span>
              <span className="text-white/40 text-[10px]">
                zsh v5.9 (x86_64)
              </span>
            </div>

            {/* Category: Portfolio & Engineering */}
            <div className="space-y-1">
              <div className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                ● Portfolio &amp; Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("about")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    about
                  </button>{" "}
                  : Full engineer biography &amp; specs
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("projects")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    projects
                  </button>{" "}
                  : Key architectures &amp; demos
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("skills")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    skills
                  </button>{" "}
                  : Full-stack &amp; systems stack
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("cp")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    cp
                  </button>{" "}
                  : CodeChef, LeetCode ratings
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("experience")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    experience
                  </button>{" "}
                  : Roles &amp; founding work
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("education")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    education
                  </button>{" "}
                  : B.Tech AI &amp; academic CPI
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("blogs")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    blogs
                  </button>{" "}
                  : Engineering articles &amp; deep-dives
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("contact")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    contact
                  </button>{" "}
                  : Email, GitHub, LinkedIn
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("resume")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    resume
                  </button>{" "}
                  : Open official resume (Drive)
                </div>
              </div>
            </div>

            {/* Category: UNIX File System */}
            <div className="space-y-1">
              <div className="text-sky-400 font-bold text-[11px] uppercase tracking-wider">
                ● UNIX Shell Utilities
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("ls -la")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    ls [-la]
                  </button>{" "}
                  : List directory contents
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("cat README.md")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    cat &lt;file&gt;
                  </button>{" "}
                  : Read file contents (e.g. README.md)
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("pwd")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    pwd
                  </button>{" "}
                  : Print working directory
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("whoami")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    whoami
                  </button>{" "}
                  : Display current user id
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("date")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    date
                  </button>{" "}
                  : Print system timestamp
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("uptime")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    uptime
                  </button>{" "}
                  : Show system uptime &amp; load
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("history")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    history
                  </button>{" "}
                  : View session commands
                </div>
                <div>
                  <span className="text-amber-300 font-semibold">
                    echo &lt;str&gt;
                  </span>{" "}
                  : Print input string
                </div>
              </div>
            </div>

            {/* Category: Networking & Diagnostics */}
            <div className="space-y-1">
              <div className="text-purple-400 font-bold text-[11px] uppercase tracking-wider">
                ● Diagnostics &amp; System
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("git status")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    git [status|log]
                  </button>{" "}
                  : Repository status &amp; commits
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("top")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    top
                  </button>{" "}
                  : Real-time process monitor
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("ping prateekdev.me")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    ping &lt;host&gt;
                  </button>{" "}
                  : Send ICMP ECHO_REQUEST
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      executeCommand("curl https://prateekdev.me/api")
                    }
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    curl &lt;url&gt;
                  </button>{" "}
                  : Transfer data from URL
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("neofetch")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    neofetch
                  </button>{" "}
                  : System hardware &amp; OS summary
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("quote")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    quote
                  </button>{" "}
                  : Engineering fortune quote
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("matrix")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    matrix
                  </button>{" "}
                  : Digital green rain easter egg
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("theme toggle")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    theme [l/d]
                  </button>{" "}
                  : Switch UI dark / light mode
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("clear")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    clear
                  </button>{" "}
                  : Reset terminal buffer
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => executeCommand("exit")}
                    className="text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    exit
                  </button>{" "}
                  : Close terminal window
                </div>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground pt-1 border-t border-white/5">
              Tip: Click any command above or press{" "}
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                Tab
              </kbd>{" "}
              /{" "}
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                →
              </kbd>{" "}
              for zsh ghost autocomplete.
            </div>
          </div>
        );
        break;
      }

      case "about":
      case "bio":
      case "info": {
        output = (
          <div className="space-y-3 text-xs font-mono text-slate-300">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold text-sm">
                  Prateek Singh
                </span>
                <span className="text-white/40 text-[11px]">
                  (@PrateekSingh2)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ● OPEN TO OPPORTUNITIES
                </span>
                <span className="text-white/40">Bhopal / Gwalior, IN</span>
              </div>
            </div>

            {/* Profile Grid / Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-white/[0.03] p-3 rounded-lg border border-white/10">
              <div>
                <span className="text-sky-300 font-semibold">ROLE:</span>{" "}
                <span className="text-white">
                  Software Systems Engineer &amp; Full-Stack Architect
                </span>
              </div>
              <div>
                <span className="text-sky-300 font-semibold">EDUCATION:</span>{" "}
                <span className="text-white">
                  B.Tech in Artificial Intelligence (MITS &apos;29)
                </span>
              </div>
              <div>
                <span className="text-sky-300 font-semibold">ACADEMICS:</span>{" "}
                <span className="text-amber-300 font-bold">
                  8.76 CGPA / CPI
                </span>
              </div>
              <div>
                <span className="text-sky-300 font-semibold">COMPETITIVE:</span>{" "}
                <span className="text-yellow-400 font-bold">
                  CodeChef 3★ (1600+) • LeetCode Knight (1900+)
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-sky-300 font-semibold">CORE FOCUS:</span>{" "}
                <span className="text-white/90">
                  Distributed Systems, High-Concurrency Backends, Memory-Safe
                  C++, LLM State Graphs
                </span>
              </div>
            </div>

            {/* Bio Prose */}
            <div className="text-muted-foreground leading-relaxed">
              I architect high-performance, fault-tolerant software systems.
              Currently developing{" "}
              <span className="text-emerald-400 font-semibold">SchemaAI</span>{" "}
              (a natural-language to SQL/GraphQL engine with zero unauthorized
              mutation bypasses) and{" "}
              <span className="text-emerald-400 font-semibold">AlgoLib</span>{" "}
              (an online judge handling 500+ execution events/minute with
              containerized sandboxes).
            </div>

            {/* Philosophy / Motto */}
            <div className="text-[11px] text-amber-300/90 italic border-l-2 border-amber-400/50 pl-2 py-0.5">
              &ldquo;Algorithmic precision and clean systems engineering: build
              things that run fast, scale cleanly, and never fail
              silently.&rdquo;
            </div>

            {/* Interactive Quick Command Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => executeCommand("projects")}
                className="px-2 py-1 rounded bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-emerald-300 text-[10px] cursor-pointer transition-all"
              >
                🚀 projects
              </button>
              <button
                type="button"
                onClick={() => executeCommand("skills")}
                className="px-2 py-1 rounded bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/40 text-sky-300 text-[10px] cursor-pointer transition-all"
              >
                ⚡ skills
              </button>
              <button
                type="button"
                onClick={() => executeCommand("cp")}
                className="px-2 py-1 rounded bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/40 text-yellow-300 text-[10px] cursor-pointer transition-all"
              >
                🏆 cp ratings
              </button>
              <button
                type="button"
                onClick={() => executeCommand("experience")}
                className="px-2 py-1 rounded bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-purple-300 text-[10px] cursor-pointer transition-all"
              >
                💼 experience
              </button>
              <button
                type="button"
                onClick={() => executeCommand("blogs")}
                className="px-2 py-1 rounded bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-cyan-300 text-[10px] cursor-pointer transition-all"
              >
                📝 blogs
              </button>
              <button
                type="button"
                onClick={() => executeCommand("resume")}
                className="px-2 py-1 rounded bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-rose-300 text-[10px] cursor-pointer transition-all"
              >
                📄 resume
              </button>
              <button
                type="button"
                onClick={() => executeCommand("contact")}
                className="px-2 py-1 rounded bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-emerald-300 text-[10px] cursor-pointer transition-all"
              >
                📬 contact
              </button>
            </div>
          </div>
        );
        break;
      }

      case "whoami": {
        output = (
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">
                visitor@portfolio-terminal
              </span>
              <span className="text-[10px] text-white/40">
                (Guest Shell Session)
              </span>
            </div>
            <div className="text-white/50 text-[11px]">
              uid=1000(visitor) gid=1000(visitor)
              groups=1000(visitor),4(adm),27(sudo-denied)
            </div>
            <div className="text-muted-foreground pt-0.5">
              Host Workstation:{" "}
              <span className="text-emerald-400 font-semibold">
                Prateek Singh
              </span>
              . Type{" "}
              <button
                type="button"
                onClick={() => executeCommand("about")}
                className="text-amber-300 font-semibold underline hover:text-amber-200 cursor-pointer"
              >
                about
              </button>{" "}
              to inspect the host profile.
            </div>
          </div>
        );
        break;
      }

      case "ls":
      case "dir": {
        const isLong =
          args.includes("-l") || args.includes("-la") || args.includes("-al");
        output = (
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            {isLong ? (
              <div className="space-y-0.5 text-[11px] leading-tight text-white/80">
                <div className="text-white/40 pb-1">total 56</div>
                <div className="flex gap-3">
                  <span className="text-white/40">drwxr-xr-x</span>
                  <span className="text-white/40">6 prateek staff</span>
                  <span className="text-white/40">192B</span>
                  <span className="text-sky-400 font-bold">projects/</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/40">drwxr-xr-x</span>
                  <span className="text-white/40">5 prateek staff</span>
                  <span className="text-white/40">160B</span>
                  <span className="text-sky-400 font-bold">skills/</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/40">drwxr-xr-x</span>
                  <span className="text-white/40">4 prateek staff</span>
                  <span className="text-white/40">128B</span>
                  <span className="text-sky-400 font-bold">blogs/</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/40">-rw-r--r--</span>
                  <span className="text-white/40">1 prateek staff</span>
                  <span className="text-white/40">3.4K</span>
                  <span className="text-slate-100">README.md</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/40">-rw-r--r--</span>
                  <span className="text-white/40">1 prateek staff</span>
                  <span className="text-white/40">1.8K</span>
                  <span className="text-slate-100">about.txt</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/40">-rw-r--r--</span>
                  <span className="text-white/40">1 prateek staff</span>
                  <span className="text-white/40">480K</span>
                  <span className="text-rose-400 font-semibold">
                    resume.pdf
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/40">-rwxr-xr-x</span>
                  <span className="text-white/40">1 prateek staff</span>
                  <span className="text-white/40">640B</span>
                  <span className="text-emerald-400 font-semibold">
                    contact.sh*
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1">
                <span className="text-sky-400 font-bold">📁 projects/</span>
                <span className="text-sky-400 font-bold">📁 skills/</span>
                <span className="text-sky-400 font-bold">📁 blogs/</span>
                <span className="text-slate-100">📄 README.md</span>
                <span className="text-slate-100">📄 about.txt</span>
                <span className="text-rose-400 font-medium">📕 resume.pdf</span>
                <span className="text-emerald-400 font-medium">
                  ⚡ contact.sh*
                </span>
              </div>
            )}
            <div className="text-[11px] text-white/40 pt-1">
              Tip: Run <span className="text-amber-300">cat README.md</span> or{" "}
              <span className="text-amber-300">cat resume.pdf</span> to view
              files.
            </div>
          </div>
        );
        break;
      }

      case "cat": {
        const file = args[0]?.toLowerCase();
        if (!file) {
          output = (
            <div className="text-rose-400 text-xs font-mono">
              Usage: cat &lt;filename&gt; (e.g. cat README.md, cat about.txt,
              cat resume.pdf)
            </div>
          );
        } else if (file === "readme.md" || file === "readme") {
          output = (
            <div className="space-y-2 text-xs font-mono text-slate-300 border-l-2 border-emerald-500 pl-3 py-1">
              <div className="text-emerald-400 font-bold text-sm">
                # Prateek Singh — Systems Engineer
              </div>
              <div className="text-muted-foreground leading-relaxed">
                Welcome to my engineering workstation. Specializing in low-level
                concurrency, high-throughput distributed backends, and
                full-stack systems.
              </div>
              <div className="text-sky-300 font-medium space-y-0.5">
                <div>
                  • Lead Architect @ AlgoLib (Dockerized Code Execution
                  Platform)
                </div>
                <div>
                  • Author @ SchemaAI (Natural Language to SQL/GraphQL Engine)
                </div>
                <div>
                  • Competitive Programmer (CodeChef 3★, LeetCode Knight 1900+)
                </div>
              </div>
              <div className="text-[11px] text-amber-300 pt-1">
                Run &apos;projects&apos; or &apos;skills&apos; to explore more.
              </div>
            </div>
          );
        } else if (file === "about.txt" || file === "about") {
          executeCommand("about");
          return;
        } else if (file === "resume.pdf" || file === "resume") {
          executeCommand("resume");
          return;
        } else if (file === "contact.sh" || file === "contact") {
          output = (
            <div className="space-y-1 text-xs font-mono text-emerald-400/90 bg-black/40 p-2.5 rounded border border-white/10">
              <div className="text-white/40">#!/usr/bin/env bash</div>
              <div>echo &quot;Connecting with Prateek Singh...&quot;</div>
              <div className="text-sky-300">
                EMAIL=&quot;prateeksinghrajawat2006@gmail.com&quot;
              </div>
              <div className="text-sky-300">
                GITHUB=&quot;https://github.com/PrateekSingh2&quot;
              </div>
              <div className="text-sky-300">
                LINKEDIN=&quot;https://linkedin.com/in/prateeksinghrajawat&quot;
              </div>
              <div className="text-white/60">
                # Status: Open to Full-Stack &amp; Systems Roles
              </div>
            </div>
          );
        } else if (file === "blogs" || file === "blogs/") {
          executeCommand("blogs");
          return;
        } else if (file === "projects" || file === "projects/") {
          executeCommand("projects");
          return;
        } else if (file === "skills" || file === "skills/") {
          executeCommand("skills");
          return;
        } else {
          output = (
            <div className="text-rose-400 text-xs font-mono">
              cat: {args[0]}: No such file or directory. Run &apos;ls&apos; to
              see available files.
            </div>
          );
        }
        break;
      }

      case "blogs":
      case "blog":
      case "articles": {
        output = (
          <div className="space-y-2.5 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-semibold flex items-center justify-between border-b border-white/10 pb-1">
              <span>Published Technical Articles:</span>
              <Link
                href="/blog"
                className="text-cyan-400 text-[11px] hover:underline"
              >
                View All on /blog ↗
              </Link>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">
                    Building SchemaAI: Natural Language to SQL &amp; GraphQL
                    Engine
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    16 Nov 2026
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px] line-clamp-2">
                  Deep dive into AST parsing, vector RAG embeddings, dynamic
                  LangGraph state machines, and zero-trust execution guardrails.
                </div>
                <div className="pt-0.5">
                  <Link
                    href="/blog/building-schema-ai-natural-language-sql-graphql-engine"
                    className="text-cyan-400 text-[11px] hover:underline font-semibold"
                  >
                    Read Article ↗
                  </Link>
                </div>
              </div>

              <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">
                    My First Tech Interview Experience: Generative AI Internship
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    20 Oct 2026
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px] line-clamp-2">
                  Key lessons from system design questions, live coding rounds,
                  vector retrieval mechanics, and engineering mindset.
                </div>
                <div className="pt-0.5">
                  <Link
                    href="/blog/my-first-tech-interview-experience-generative-ai-internship"
                    className="text-cyan-400 text-[11px] hover:underline font-semibold"
                  >
                    Read Article ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
        break;
      }

      case "projects": {
        const idArg = args[0]?.toLowerCase();
        if (idArg) {
          const found = PROJECTS_DATA.find(
            (p) =>
              p.id.toLowerCase() === idArg ||
              p.title.toLowerCase().includes(idArg),
          );
          if (found) {
            output = (
              <div className="space-y-1.5 text-xs font-mono text-slate-300 border-l-2 border-emerald-500 pl-3 py-1">
                <div className="text-emerald-400 font-bold text-sm">
                  {found.title}
                </div>
                <div className="text-muted-foreground">{found.description}</div>
                <div className="text-sky-300">
                  Stack: {found.tech.join(" • ")}
                </div>
                <div className="text-amber-300">Metrics: {found.metrics}</div>
                <div className="flex gap-4 pt-1">
                  <a
                    href={found.live}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Live Demo ↗
                  </a>
                  <a
                    href={found.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    GitHub Repo ↗
                  </a>
                </div>
              </div>
            );
          } else {
            output = (
              <div className="text-rose-400 text-xs font-mono">
                Project &apos;{idArg}&apos; not found. Run &apos;projects&apos;
                to view all.
              </div>
            );
          }
        } else {
          output = (
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="text-sky-400 font-semibold flex items-center justify-between border-b border-white/10 pb-1">
                <span>Featured Engineering Projects:</span>
                <span className="text-[10px] text-white/40">
                  {PROJECTS_DATA.length} repositories
                </span>
              </div>
              {PROJECTS_DATA.map((p) => (
                <div
                  key={p.id}
                  className="border-l border-white/10 pl-2.5 py-0.5 space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      [{p.category}]
                    </span>
                  </div>
                  <div className="text-muted-foreground line-clamp-1">
                    {p.shortDesc}
                  </div>
                  <div className="text-cyan-400/90 text-[11px] flex gap-3">
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Demo ↗
                    </a>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      GitHub ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => executeCommand(`projects ${p.id}`)}
                      className="text-amber-300 hover:underline cursor-pointer"
                    >
                      inspect details &gt;
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-[11px] text-muted-foreground pt-1">
                Run <span className="text-amber-300">projects schema-ai</span>{" "}
                or click inspect to view deep architectural breakdown.
              </div>
            </div>
          );
        }
        break;
      }

      case "cp": {
        output = (
          <div className="space-y-2.5 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-semibold border-b border-white/10 pb-1 flex items-center justify-between">
              <span>Competitive Programming Track Record:</span>
              <span className="text-[10px] text-amber-300">
                700+ Problems Solved
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold">
                    CodeChef (3★)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    1600+ Rating
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  Handle: nice_trail_87 • Global Division 2
                </div>
                <a
                  href="https://www.codechef.com/users/nice_trail_87"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 text-[11px] hover:underline block pt-0.5"
                >
                  View CodeChef Profile ↗
                </a>
              </div>

              <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300 font-bold">
                    LeetCode (Knight)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-300">
                    1900+ Rating
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  Top 5% Globally • 700+ Problems Solved
                </div>
                <a
                  href="https://leetcode.com/u/prateek_singh7/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 text-[11px] hover:underline block pt-0.5"
                >
                  View LeetCode Profile ↗
                </a>
              </div>

              <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">Codeforces</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                    Specialist
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  Handle: RajawatPrateekSingh
                </div>
                <a
                  href="https://codeforces.com/profile/RajawatPrateekSingh"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 text-[11px] hover:underline block pt-0.5"
                >
                  View Codeforces Profile ↗
                </a>
              </div>

              <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-bold">
                    GeeksforGeeks
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Rank #1
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  College Institute Rank 1 • 500+ Solved
                </div>
                <a
                  href="https://www.geeksforgeeks.org/profile/rajawatprateeksingh"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 text-[11px] hover:underline block pt-0.5"
                >
                  View GFG Profile ↗
                </a>
              </div>
            </div>
          </div>
        );
        break;
      }

      case "skills": {
        output = (
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-semibold border-b border-white/10 pb-1">
              Technical Stack &amp; Core Competencies:
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-emerald-400 font-bold">Languages:</span>{" "}
                C++, Python, Java, TypeScript, JavaScript, SQL, HTML/CSS
              </div>
              <div>
                <span className="text-emerald-400 font-bold">Frameworks:</span>{" "}
                Next.js 16, React 19, FastAPI, Express.js, Node.js, Tailwind CSS
              </div>
              <div>
                <span className="text-emerald-400 font-bold">
                  AI &amp; Graph:
                </span>{" "}
                LangGraph, Vector RAG, AST SQLGlot, LlamaIndex, OpenAI,
                HuggingFace
              </div>
              <div>
                <span className="text-emerald-400 font-bold">Databases:</span>{" "}
                PostgreSQL, Supabase, MongoDB, SQLite, Redis, Firebase
              </div>
              <div>
                <span className="text-emerald-400 font-bold">
                  DevOps &amp; Tools:
                </span>{" "}
                Docker, Git, GitHub Actions, Linux/Bash, Netlify, Turbopack
              </div>
              <div>
                <span className="text-emerald-400 font-bold">
                  Architectures:
                </span>{" "}
                Distributed Systems, Concurrency, Microservices, Event-Driven
              </div>
            </div>
          </div>
        );
        break;
      }

      case "experience": {
        output = (
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-semibold border-b border-white/10 pb-1">
              Professional Engineering Experience:
            </div>
            <div className="border-l-2 border-emerald-400 pl-3 py-1 space-y-1">
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">
                  AlgoLib — Founder &amp; Lead Architect
                </span>
                <span className="text-muted-foreground text-[11px]">
                  2026 - Present
                </span>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Engineered online code judge handling 500+ events/min with
                dockerized sandbox containers. Leading 5-member cross-functional
                team turning algorithm visualizer into enterprise-ready product.
              </div>
            </div>
            <div className="border-l-2 border-sky-400 pl-3 py-1 space-y-1">
              <div className="flex justify-between">
                <span className="text-sky-400 font-bold">
                  DecodeLabs — Full Stack Developer
                </span>
                <span className="text-muted-foreground text-[11px]">
                  Remote
                </span>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Built scalable frontend and backend APIs, integrated telemetry,
                and reduced client latency by 35%.
              </div>
            </div>
          </div>
        );
        break;
      }

      case "education": {
        output = (
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-semibold border-b border-white/10 pb-1">
              Academic Credentials:
            </div>
            <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">
                  Madhav Institute of Technology &amp; Science (MITS)
                </span>
                <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  8.76 CGPA
                </span>
              </div>
              <div>B.Tech in Artificial Intelligence (Aug 2025 - May 2029)</div>
              <div className="text-muted-foreground text-[11px]">
                Relevant Coursework: Data Structures &amp; Algorithms, Operating
                Systems, Database Management Systems, Machine Learning, Computer
                Networks, Linear Algebra.
              </div>
            </div>
          </div>
        );
        break;
      }

      case "contact": {
        output = (
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-semibold border-b border-white/10 pb-1">
              Connect with Prateek:
            </div>
            <div className="space-y-1 text-[11px]">
              <div>
                📧 Email:{" "}
                <a
                  href="mailto:prateeksinghrajawat2006@gmail.com"
                  className="text-emerald-400 hover:underline"
                >
                  prateeksinghrajawat2006@gmail.com
                </a>
              </div>
              <div>
                🐙 GitHub:{" "}
                <a
                  href="https://github.com/PrateekSingh2"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  github.com/PrateekSingh2
                </a>
              </div>
              <div>
                💼 LinkedIn:{" "}
                <a
                  href="https://linkedin.com/in/prateeksinghrajawat"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  linkedin.com/in/prateeksinghrajawat
                </a>
              </div>
              <div>
                🌐 Portfolio:{" "}
                <a
                  href="https://prateekdev.me"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:underline"
                >
                  prateekdev.me
                </a>
              </div>
            </div>
          </div>
        );
        break;
      }

      case "pwd": {
        output = (
          <div className="text-emerald-400 text-xs font-mono">
            /home/prateek/portfolio
          </div>
        );
        break;
      }

      case "date": {
        output = (
          <div className="text-emerald-400 text-xs font-mono">
            {new Date().toString()}
          </div>
        );
        break;
      }

      case "uptime": {
        output = (
          <div className="text-xs font-mono space-y-0.5 text-slate-300">
            <div>
              <span className="text-emerald-400 font-bold">
                {new Date().toLocaleTimeString()}
              </span>{" "}
              up 142 days, 4:12, 1 user, load average: 0.12, 0.08, 0.05
            </div>
            <div className="text-white/40 text-[11px]">
              99.98% High Availability • Zero Downtime Edge Architecture
            </div>
          </div>
        );
        break;
      }

      case "history": {
        output = (
          <div className="space-y-0.5 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-semibold pb-0.5 border-b border-white/10">
              Session Command History:
            </div>
            {commandHistory.length === 0 ? (
              <div className="text-white/40 pt-1">
                No commands in history yet.
              </div>
            ) : (
              commandHistory.map((c, i) => (
                <div key={i} className="flex gap-3 pt-0.5">
                  <span className="text-white/30 w-6 text-right select-none">
                    {i + 1}
                  </span>
                  <span className="text-emerald-300">{c}</span>
                </div>
              ))
            )}
          </div>
        );
        break;
      }

      case "echo": {
        output = (
          <div className="text-slate-200 text-xs font-mono">
            {args.join(" ") || ""}
          </div>
        );
        break;
      }

      case "git": {
        const sub = args[0]?.toLowerCase();
        if (sub === "status") {
          output = (
            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className="text-white/60">
                On branch{" "}
                <span className="text-emerald-400 font-bold">main</span>
              </div>
              <div className="text-white/60">
                Your branch is up to date with &apos;origin/main&apos;.
              </div>
              <div className="text-emerald-400 pt-0.5">
                nothing to commit, working tree clean
              </div>
            </div>
          );
        } else if (sub === "log") {
          output = (
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="border-l-2 border-amber-400 pl-2">
                <div className="text-amber-300">
                  commit 8f42d19 (HEAD -&gt; main, origin/main)
                </div>
                <div className="text-white/50 text-[11px]">
                  Author: Prateek Singh &lt;prateek@dev&gt;
                </div>
                <div className="text-white/50 text-[11px]">
                  Date: {new Date().toDateString()}
                </div>
                <div className="text-white font-medium pt-0.5">
                  feat: complete developer CLI workstation with UNIX tools &amp;
                  live clock
                </div>
              </div>
              <div className="border-l-2 border-white/20 pl-2">
                <div className="text-amber-300">commit c317b90</div>
                <div className="text-white/50 text-[11px]">
                  Author: Prateek Singh &lt;prateek@dev&gt;
                </div>
                <div className="text-white font-medium pt-0.5">
                  feat: implement SchemaAI LangGraph state machine &amp; AST
                  validation
                </div>
              </div>
              <div className="border-l-2 border-white/20 pl-2">
                <div className="text-amber-300">commit e04a112</div>
                <div className="text-white/50 text-[11px]">
                  Author: Prateek Singh &lt;prateek@dev&gt;
                </div>
                <div className="text-white font-medium pt-0.5">
                  feat: launch AlgoLib real-time code judge sandbox
                </div>
              </div>
            </div>
          );
        } else {
          output = (
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <div>git version 2.44.0</div>
              <div className="text-muted-foreground">
                Supported commands:{" "}
                <button
                  type="button"
                  onClick={() => executeCommand("git status")}
                  className="text-amber-300 hover:underline"
                >
                  git status
                </button>
                ,{" "}
                <button
                  type="button"
                  onClick={() => executeCommand("git log")}
                  className="text-amber-300 hover:underline"
                >
                  git log
                </button>
              </div>
            </div>
          );
        }
        break;
      }

      case "top":
      case "htop": {
        output = (
          <div className="space-y-2 text-xs font-mono text-slate-300 select-none">
            <div className="flex flex-wrap justify-between text-white/50 text-[11px] border-b border-white/10 pb-1">
              <span>
                Tasks:{" "}
                <span className="text-emerald-400 font-bold">18 total</span>, 1
                running, 17 sleeping
              </span>
              <span>
                Load Avg:{" "}
                <span className="text-emerald-400 font-bold">
                  0.14, 0.09, 0.05
                </span>
              </span>
              <span>
                Mem: <span className="text-amber-300 font-bold">42.8 MB</span> /
                128 MB
              </span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="grid grid-cols-6 text-white/40 font-bold border-b border-white/5 pb-0.5">
                <span>PID</span>
                <span>USER</span>
                <span>CPU%</span>
                <span>MEM%</span>
                <span className="col-span-2">COMMAND</span>
              </div>
              <div className="grid grid-cols-6 text-slate-200">
                <span className="text-amber-300">1042</span>
                <span className="text-white/50">prateek</span>
                <span className="text-emerald-400">1.8%</span>
                <span>4.2%</span>
                <span className="col-span-2 text-emerald-300">
                  schema-ai-engine --rag
                </span>
              </div>
              <div className="grid grid-cols-6 text-slate-200">
                <span className="text-amber-300">1098</span>
                <span className="text-white/50">prateek</span>
                <span className="text-emerald-400">1.2%</span>
                <span>3.8%</span>
                <span className="col-span-2 text-sky-300">
                  algolib-judge-worker
                </span>
              </div>
              <div className="grid grid-cols-6 text-slate-200">
                <span className="text-amber-300">1204</span>
                <span className="text-white/50">prateek</span>
                <span className="text-emerald-400">0.4%</span>
                <span>2.1%</span>
                <span className="col-span-2 text-slate-300">
                  nextjs-turbopack
                </span>
              </div>
              <div className="grid grid-cols-6 text-slate-200">
                <span className="text-amber-300">1450</span>
                <span className="text-white/50">prateek</span>
                <span className="text-emerald-400">0.1%</span>
                <span>1.5%</span>
                <span className="col-span-2 text-slate-400">pg-vector-db</span>
              </div>
            </div>
            <div className="text-[10px] text-white/40 pt-1">
              Press any command to continue shell session.
            </div>
          </div>
        );
        break;
      }

      case "ping": {
        const targetHost = args[0] || "google.com";
        output = <ActivePing rawHost={targetHost} />;
        break;
      }

      case "curl": {
        const targetUrl =
          args[0] || "https://api.github.com/users/PrateekSingh2";
        output = <ActiveCurl rawUrl={targetUrl} />;
        break;
      }

      case "quote":
      case "fortune": {
        const quotes = [
          {
            text: "Talk is cheap. Show me the code.",
            author: "Linus Torvalds",
          },
          {
            text: "Simplicity is prerequisite for reliability.",
            author: "Edsger W. Dijkstra",
          },
          {
            text: "Premature optimization is the root of all evil.",
            author: "Donald E. Knuth",
          },
          {
            text: "Make it work, make it right, make it fast.",
            author: "Kent Beck",
          },
          {
            text: "The best way to predict the future is to invent it.",
            author: "Alan Kay",
          },
        ];
        const q = quotes[history.length % quotes.length];
        output = (
          <div className="p-2.5 rounded bg-white/5 border border-white/10 space-y-1 text-xs font-mono">
            <div className="text-emerald-300 italic">
              &ldquo;{q.text}&rdquo;
            </div>
            <div className="text-white/40 text-[11px] text-right">
              — {q.author}
            </div>
          </div>
        );
        break;
      }

      case "matrix": {
        output = (
          <ActiveMatrix
            onExit={() => {
              setHistory((prev) => [
                ...prev,
                {
                  id: `matrix-exit-${prev.length}`,
                  command: "exit-matrix",
                  output: (
                    <div className="text-emerald-400/80 text-xs font-mono">
                      [Matrix digital rain disconnected. Returned to shell
                      prompt.]
                    </div>
                  ),
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            }}
          />
        );
        break;
      }

      case "theme": {
        const targetTheme = args[0]?.toLowerCase();
        if (targetTheme === "dark") {
          setTheme("dark");
          output = (
            <div className="text-emerald-400 text-xs font-mono">
              Theme switched to Dark Mode 🌙
            </div>
          );
        } else if (targetTheme === "light") {
          setTheme("light");
          output = (
            <div className="text-amber-400 text-xs font-mono">
              Theme switched to Light Mode ☀️
            </div>
          );
        } else {
          const next = theme === "dark" ? "light" : "dark";
          setTheme(next);
          output = (
            <div className="text-sky-400 text-xs font-mono">
              Theme toggled to {next.toUpperCase()} Mode!
            </div>
          );
        }
        break;
      }

      case "resume": {
        const resumeUrl =
          "https://drive.google.com/file/d/1agSy6MjDGamW8K1qbfSUb80sTH_OMreM/view";
        if (typeof window !== "undefined") {
          window.open(resumeUrl, "_blank");
        }
        output = (
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="text-emerald-400 font-bold">
              Opening Prateek Singh&apos;s Official Resume...
            </div>
            <div className="text-muted-foreground">
              Opened resume in a new tab. If not redirected automatically,{" "}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 font-semibold underline hover:text-cyan-300"
              >
                click here to open Resume on Google Drive ↗
              </a>
            </div>
          </div>
        );
        break;
      }

      case "neofetch": {
        output = (
          <div className="flex flex-col sm:flex-row gap-4 text-xs font-mono text-slate-300 pt-1">
            <div className="text-emerald-400 leading-tight font-bold whitespace-pre select-none">
              {`   _____ _____ 
  / ____/ ____|
 | |   | |  __ 
 | |   | | |_ |
 | |___| |__| |
  \\_____\\_____|`}
            </div>
            <div className="space-y-0.5">
              <div>
                <span className="text-emerald-400 font-bold">prateek</span>@
                <span className="text-sky-400">portfolio-v2</span>
              </div>
              <div className="text-white/20">----------------------</div>
              <div>
                <span className="text-amber-300">OS:</span> Next.js 16.2 (Linux
                x86_64)
              </div>
              <div>
                <span className="text-amber-300">Host:</span> Vercel / Netlify
                Edge Engine
              </div>
              <div>
                <span className="text-amber-300">Kernel:</span> React 19.2.4
                (Turbopack)
              </div>
              <div>
                <span className="text-amber-300">Uptime:</span> 99.98% High
                Availability
              </div>
              <div>
                <span className="text-amber-300">Shell:</span> PrateekShell v2.4
                (zsh-autosuggestions)
              </div>
              <div>
                <span className="text-amber-300">Editor:</span> Neovim / VS Code
              </div>
              <div>
                <span className="text-amber-300">Memory:</span> 64MB / 128MB
                Serverless Bounded
              </div>
              {/* Authentic terminal color blocks palette */}
              <div className="flex gap-1.5 pt-2 select-none">
                <span className="w-3.5 h-3.5 rounded-xs bg-black border border-white/20" />
                <span className="w-3.5 h-3.5 rounded-xs bg-rose-500" />
                <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500" />
                <span className="w-3.5 h-3.5 rounded-xs bg-amber-400" />
                <span className="w-3.5 h-3.5 rounded-xs bg-sky-500" />
                <span className="w-3.5 h-3.5 rounded-xs bg-purple-500" />
                <span className="w-3.5 h-3.5 rounded-xs bg-cyan-400" />
                <span className="w-3.5 h-3.5 rounded-xs bg-white" />
              </div>
            </div>
          </div>
        );
        break;
      }

      case "sudo": {
        output = (
          <div className="text-rose-400 text-xs font-mono">
            Permission denied: User &apos;visitor&apos; is not in the sudoers
            file. This incident has been logged to /dev/null 🙃
          </div>
        );
        break;
      }

      case "clear":
      case "cls": {
        setHistory([]);
        setShowBanner(false);
        setInputVal("");
        return;
      }

      case "exit": {
        setIsOpen(false);
        setInputVal("");
        return;
      }

      default: {
        output = (
          <div className="text-rose-400 text-xs font-mono">
            Command not recognized: &apos;{cmd}&apos;. Type{" "}
            <button
              type="button"
              onClick={() => executeCommand("help")}
              className="text-amber-300 font-semibold underline hover:text-amber-200 cursor-pointer"
            >
              &apos;help&apos;
            </button>{" "}
            to see available commands.
          </div>
        );
      }
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        command: trimmed,
        output,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // macOS zsh autocomplete: Tab or Right Arrow accepts the inline ghost suggestion
    if (
      e.key === "Tab" ||
      (e.key === "ArrowRight" &&
        e.currentTarget.selectionStart === inputVal.length)
    ) {
      if (activeSuggestion) {
        e.preventDefault();
        setInputVal(activeSuggestion);
        return;
      } else if (e.key === "Tab") {
        e.preventDefault();
        const matches = COMMAND_LIST.filter((c) =>
          c.startsWith(inputVal.toLowerCase()),
        );
        if (matches.length === 1) {
          setInputVal(matches[0]);
        } else if (matches.length > 1) {
          setHistory((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              command: inputVal,
              output: (
                <div className="text-xs font-mono text-muted-foreground flex gap-4 flex-wrap">
                  {matches.map((m) => (
                    <span key={m} className="text-amber-300 font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              ),
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      }
    } else if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(null);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    }
  };

  return (
    <>
      {/* Floating Bottom-Left Pill Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => {
            setIsMinimized(false);
            setIsOpen((prev) => !prev);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#090d16]/80 hover:border-emerald-500/50 hover:bg-emerald-500/10 backdrop-blur-md shadow-lg text-xs font-mono text-foreground hover:text-emerald-400 transition-all cursor-pointer group"
          title="Toggle Developer Terminal (` or ~)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Terminal className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="font-semibold hidden sm:inline">
            {isMinimized ? "CLI (minimized)" : "CLI"}
          </span>
          <kbd className="hidden sm:inline-block px-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-[9px] text-muted-foreground">
            ~
          </kbd>
        </button>
      </div>

      {/* Terminal Modal Drawer - z-[100] so it completely covers the Navbar (z-50) when opened and maximized */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            key="terminal-modal-overlay"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            /* Crucial: DO NOT close when clicked outside of the terminal; pointer events pass through overlay to window only */
            className={`fixed z-[100] flex flex-col items-center justify-center ${
              isMaximized
                ? "inset-0 w-screen h-screen bg-[#070b13] p-0"
                : "inset-0 p-3 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
            }`}
          >
            <motion.div
              layout
              transition={{
                layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
              /* Crucial: Terminal card handles clicks, and clicking outside does NOT close it */
              className={`w-full border border-white/15 bg-[#090d16] text-slate-100 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden ${
                isMaximized
                  ? "h-full w-full rounded-none border-none"
                  : "h-[540px] max-w-2xl rounded-2xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Header Bar with Authentic macOS Styling */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d1322] border-b border-white/12 select-none shrink-0 relative">
                {/* Authentic macOS Traffic Light Window Controls */}
                <div className="flex items-center gap-2 group/traffic shrink-0">
                  {/* 1. Close Button (macOS Red) */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center cursor-pointer shadow-xs active:brightness-75 transition-all"
                    title="Close Terminal (✕)"
                    aria-label="Close Terminal"
                  >
                    <X className="w-2 h-2 text-[#4c0000] stroke-[3] opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-150" />
                  </button>

                  {/* 2. Minimize Button (macOS Yellow) */}
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center cursor-pointer shadow-xs active:brightness-75 transition-all"
                    title="Minimize Terminal (−)"
                    aria-label="Minimize Terminal"
                  >
                    <Minus className="w-2 h-2 text-[#5f3f00] stroke-[3.5] opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-150" />
                  </button>

                  {/* 3. Maximize Button (macOS Green) */}
                  <button
                    type="button"
                    onClick={() => setIsMaximized((prev) => !prev)}
                    className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center cursor-pointer shadow-xs active:brightness-75 transition-all"
                    title={
                      isMaximized
                        ? "Restore window size"
                        : "Maximize Fullscreen (covers navbar)"
                    }
                    aria-label="Toggle Fullscreen"
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-2 h-2 text-[#004f00] stroke-[3] opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-150" />
                    ) : (
                      <Maximize2 className="w-2 h-2 text-[#004f00] stroke-[3] opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-150" />
                    )}
                  </button>
                </div>

                {/* Title & Path */}
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/90 font-medium select-none">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>prateek@dev: ~ (zsh)</span>
                </div>

                {/* Clean macOS-style Right Action: Sleek Copy Button (No duplicate cross button!) */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLogs}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-white/45 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-xs group/copy"
                    title="Copy session output"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 group-hover/copy:text-white transition-colors" />
                        <span className="text-[10px] font-mono text-white/50 group-hover/copy:text-white transition-colors hidden sm:inline">
                          Copy
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Terminal Body with Scrollable Output */}
              <div
                className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 font-mono text-xs select-text cursor-text leading-relaxed"
                onClick={() => inputRef.current?.focus()}
              >
                {showBanner && <WelcomeBanner onRunCommand={executeCommand} />}
                {history.map((h) => (
                  <div key={h.id} className="space-y-1">
                    {h.command && (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold select-none">
                          prateek@dev:~$
                        </span>
                        <span className="text-slate-100 font-semibold">
                          {h.command}
                        </span>
                        <span className="text-[10px] text-white/30 ml-auto select-none">
                          {h.timestamp}
                        </span>
                      </div>
                    )}
                    <div className="pl-0 sm:pl-2">{h.output}</div>
                  </div>
                ))}

                {/* Active Command Prompt Line with macOS ZSH Ghost Autosuggestion */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-emerald-400 font-bold select-none shrink-0">
                    prateek@dev:~$
                  </span>

                  {/* Layered Input Container for sub-pixel aligned zsh ghost text */}
                  <div className="relative flex-1 flex items-center overflow-hidden">
                    {/* Underlay: Ghost Autosuggestion Layer */}
                    <div
                      className="absolute inset-0 flex items-center font-mono text-xs pointer-events-none select-none whitespace-pre overflow-hidden"
                      aria-hidden="true"
                    >
                      <span className="opacity-0">{inputVal}</span>
                      {activeSuggestion && (
                        <span className="text-white/35 dark:text-white/30">
                          {activeSuggestion.slice(inputVal.length)}
                        </span>
                      )}
                    </div>

                    {/* Foreground: Actual Typing Input */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="relative z-10 w-full bg-transparent text-xs font-mono text-slate-100 focus:outline-none placeholder:text-white/20"
                      placeholder={
                        !activeSuggestion ? "type 'help' or any command..." : ""
                      }
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => executeCommand(inputVal)}
                    className="text-white/40 hover:text-emerald-400 p-0.5 cursor-pointer shrink-0"
                    title="Execute"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div ref={bottomRef} />
              </div>

              {/* Terminal Status Footer */}
              <div className="px-4 py-2 bg-[#0d1322] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-muted-foreground/70 select-none">
                <div>
                  Press <kbd className="text-white/80 font-bold">Tab</kbd> or{" "}
                  <kbd className="text-white/80 font-bold">→</kbd> to accept
                  ghost suggestion
                </div>
                <div className="hidden sm:block">
                  Click{" "}
                  <span className="text-rose-400 font-semibold">
                    ● red light
                  </span>{" "}
                  or type &apos;exit&apos; to close
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
