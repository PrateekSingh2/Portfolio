"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { buttonVariants } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface TerminalLine {
  text: string;
  type: "command" | "output" | "system" | "error";
}

// Mock File System
const mockFileSystem: Record<string, string[]> = {
  "~": ["about.txt", "skills.md", "projects/", "thoughts.txt"],
  "~/projects": ["blo.txt", "formforge.txt"],
};

const mockFileContents: Record<string, string> = {
  "~/about.txt": "I am Prateek Singh, a B.Tech student focusing on AI, systems, and competitive programming.",
  "~/skills.md": "Languages: Python, C++, TypeScript, JavaScript, SQL\nFrameworks: Next.js, React, Tailwind CSS, Tkinter",
  "~/thoughts.txt": "AI will not replace engineers. Engineers using AI will replace those who don't.",
  "~/projects/blo.txt": "Virtual Voter Card Making System. Built with Python & Tkinter.",
  "~/projects/formforge.txt": "Dynamic Form Builder with AI Assistance. Built with Next.js & TypeScript.",
};

const AVAILABLE_COMMANDS = [
  "help", "whoami", "skills", "experience", "socials", 
  "theme", "joke", "matrix", "sudo", "rickroll", "clear", "secret", "ls", "cd", "cat"
];

export function HeroSection() {
  const { theme, setTheme } = useTheme();
  const titles = [
    "Competitive Programmer",
    "Problem Solver",
    "AI Engineer",
    "Systems Builder",
  ];

  // Terminal States
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "whoami", type: "command" },
    { text: "→ Prateek Singh", type: "output" },
    { text: "→ AI, B.Tech (2029)", type: "output" },
    { text: "→ Competitive Programmer | Codeforces Newbie", type: "output" },
    { text: "→ Interests: DSA, Systems, GenAI", type: "output" },
    { text: "Type 'help' to see other interactive commands.", type: "system" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState("~");
  const [isCrashed, setIsCrashed] = useState(false);

  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [history]);

  // Handle Crash Recovery (Press any key to reboot)
  useEffect(() => {
    if (isCrashed) {
      const handleReboot = () => {
        setIsCrashed(false);
        setHistory([
          { text: "System recovered from unexpected fatal crash.", type: "system" },
          { text: "Unauthorized sudo attempt logged.", type: "error" },
        ]);
      };
      window.addEventListener("keydown", handleReboot);
      return () => window.removeEventListener("keydown", handleReboot);
    }
  }, [isCrashed]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Command History Navigation (Up/Down)
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    } 
    // Auto-complete (Tab)
    else if (e.key === "Tab") {
      e.preventDefault();
      const currentInput = inputValue.trim().toLowerCase();
      const match = AVAILABLE_COMMANDS.find(cmd => cmd.startsWith(currentInput));
      if (match) {
        setInputValue(match);
      }
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputValue.trim();
    if (!rawCmd) return;

    // Reset history browsing index
    setHistoryIndex(-1);
    
    // Add to command history array (if not same as last command)
    if (commandHistory[commandHistory.length - 1] !== rawCmd) {
      setCommandHistory(prev => [...prev, rawCmd]);
    }

    const args = rawCmd.split(" ");
    const cmd = args[0].toLowerCase();

    const newHistory = [...history, { text: `${currentPath} ❯ ${rawCmd}`, type: "command" as const }];

    // Trigger System Crash Easter Egg!
    if (rawCmd === "sudo rm -rf /") {
      setIsCrashed(true);
      setInputValue("");
      return;
    }

    switch (cmd) {
      case "help":
        newHistory.push(
          { text: "Available commands:", type: "system" },
          { text: "  whoami      - Learn about me", type: "output" },
          { text: "  skills      - List my core developer skills", type: "output" },
          { text: "  experience  - Show my developer experience summary", type: "output" },
          { text: "  socials     - Print GitHub, LinkedIn, and Email handles", type: "output" },
          { text: "  theme       - Toggle the website theme (light/dark)", type: "output" },
          { text: "  ls          - List directory contents", type: "output" },
          { text: "  cd <dir>    - Change directory", type: "output" },
          { text: "  cat <file>  - Read a file", type: "output" },
          { text: "  clear       - Clear the terminal screen", type: "output" },
          { text: "  sudo        - Request superuser permissions", type: "output" }
        );
        break;
      
      // ... File System Commands ...
      case "ls":
        const contents = mockFileSystem[currentPath];
        if (contents) {
          newHistory.push({ text: contents.join("   "), type: "output" });
        } else {
          newHistory.push({ text: `ls: cannot access '${currentPath}': No such file or directory`, type: "error" });
        }
        break;
      case "cd":
        const targetDir = args[1];
        if (!targetDir || targetDir === "~") {
          setCurrentPath("~");
        } else if (targetDir === "projects" || targetDir === "projects/") {
          if (currentPath === "~") setCurrentPath("~/projects");
          else newHistory.push({ text: `cd: ${targetDir}: No such file or directory`, type: "error" });
        } else if (targetDir === "..") {
          if (currentPath === "~/projects") setCurrentPath("~");
        } else {
          newHistory.push({ text: `cd: ${targetDir}: No such file or directory`, type: "error" });
        }
        break;
      case "cat":
        const targetFile = args[1];
        if (!targetFile) {
          newHistory.push({ text: "cat: missing file operand", type: "error" });
          break;
        }
        // Normalize path
        let lookupPath = targetFile;
        if (!targetFile.startsWith("~/")) {
          lookupPath = currentPath === "~" ? `~/${targetFile}` : `${currentPath}/${targetFile}`;
        }
        const fileData = mockFileContents[lookupPath];
        if (fileData) {
          const lines = fileData.split("\n");
          lines.forEach(l => newHistory.push({ text: l, type: "output" }));
        } else {
          newHistory.push({ text: `cat: ${targetFile}: No such file or directory`, type: "error" });
        }
        break;

      // ... Existing Commands ...
      case "whoami":
        newHistory.push(
          { text: "→ Prateek Singh", type: "output" },
          { text: "→ B.Tech student in Artificial Intelligence (2029)", type: "output" },
          { text: "→ Passionate builder focused on CP, systems, and GenAI", type: "output" }
        );
        break;
      case "skills":
        newHistory.push(
          { text: "→ Languages: Python, C++, TypeScript, JavaScript, SQL", type: "output" },
          { text: "→ Frameworks: React, Next.js, Tkinter, Tailwind CSS", type: "output" },
          { text: "→ Databases: MySQL, PostgreSQL, Firebase", type: "output" }
        );
        break;
      case "experience":
        newHistory.push(
          { text: "→ Software Engineer Intern @ Web3 Company", type: "output" },
          { text: "→ Technical Head @ Coding Club (AI & DSA mentorship)", type: "output" }
        );
        break;
      case "socials":
        newHistory.push(
          { text: "→ GitHub:   github.com/PrateekSingh2", type: "output" },
          { text: "→ LinkedIn: linkedin.com/in/rajawatprateeksingh", type: "output" },
          { text: "→ Email:    prateeksinghrajawat2006@gmail.com", type: "output" }
        );
        break;
      case "clear":
        setHistory([]);
        setInputValue("");
        return;
      case "theme":
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        newHistory.push(
          { text: "→ Executing theme override...", type: "system" },
          { text: `→ Theme toggled to: ${nextTheme.toUpperCase()} mode!`, type: "output" }
        );
        break;
      case "joke":
        const jokes = [
          "Why do programmers wear glasses? Because they can't C#!",
          "There are 10 types of people in the world: those who understand binary, and those who don't.",
          "How many programmers does it take to change a light bulb? None, it's a hardware problem.",
          "What is a programmer's favorite hangout place? Foo Bar!"
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        newHistory.push({ text: `→ ${randomJoke}`, type: "output" });
        break;
      case "sudo":
        newHistory.push({ text: "→ Sudo privilege escalation failed: User RajawatPrateekSingh is not in the sudoers file. This incident has been reported.", type: "error" });
        break;
      case "matrix":
        newHistory.push(
          { text: "Initializing matrix stream...", type: "system" },
          { text: "→ 01010110 01101001 01110010 01110100 01110101 01100001 01101100", type: "output" },
          { text: "→ 01001000 01100001 01100011 01101011 01100101 01110010 01011111", type: "output" },
          { text: "→ 01110011 01111001 01110011 01110100 01100101 01101101 01001111", type: "output" },
          { text: "System connection secured. Access granted.", type: "system" }
        );
        break;
      case "rickroll":
        newHistory.push(
          { text: "🎵 Rick Astley — Never Gonna Give You Up 🎵", type: "system" },
          { text: "→ Never gonna give you up,", type: "output" },
          { text: "→ Never gonna let you down,", type: "output" },
          { text: "→ Never gonna run around and desert you!", type: "output" }
        );
        break;
      case "secret":
        newHistory.push(
          { text: "✨ Easter Egg Discovered! ✨", type: "system" },
          { text: "⚡ fun_fact: CodeChef graphs are RegExp parsed straight from profile HTML script blocks!", type: "output" },
          { text: "☕ Coffee consumed to code this portfolio: 18 cups.", type: "output" }
        );
        break;
      default:
        newHistory.push({
          text: `Command not found: '${cmd}'. Type 'help' for options.`,
          type: "error",
        });
    }

    setHistory(newHistory);
    setInputValue("");
  };

  // --- BSOD Crash Overlay Component ---
  if (isCrashed) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0000AA] text-white font-mono p-8 md:p-16 flex flex-col justify-center items-start cursor-none">
        <div className="max-w-3xl">
          <div className="bg-white text-[#0000AA] px-4 py-1 inline-block font-bold mb-8">
            Windows
          </div>
          <p className="mb-6 text-lg md:text-xl">
            A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.
            The current application will be terminated.
          </p>
          <ul className="mb-8 space-y-4 text-base md:text-lg">
            <li>* Press any key to terminate the current application.</li>
            <li>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
          </ul>
          <p className="animate-pulse text-lg mt-12">Press any key to continue _</p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto w-full px-4 pt-20 pb-12 relative min-h-[75vh] flex flex-col justify-center" id="hero">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 -z-10 w-full bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Greeting & Name */}
        <div className="mb-3">
          <p className="text-sm md:text-base font-mono font-medium text-slate-400 mb-1">
            Hi, I&apos;m
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Prateek Singh
          </h1>
        </div>

        {/* Typewriter subtitle */}
        <div className="text-base md:text-lg text-primary font-mono mb-4 h-7">
          <TypewriterEffect words={titles} />
        </div>

        {/* Bio */}
        <p className="text-muted-foreground text-base mb-8 max-w-xl leading-relaxed">
          B.Tech AI student focused on competitive programming, low-level systems design, and building scalable software.
          Currently enhancing my problem-solving skills and exploring system architecture.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 mb-12">
          <a
            href="/resume.pdf"
            target="_blank"
            className={buttonVariants({
              variant: "default",
              className: "h-10 px-4.5 gap-2.5 font-mono text-sm font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform"
            })}
          >
            <FileText className="w-5 h-5" />
            Resume
          </a>
          <a
            href="https://github.com/PrateekSingh2"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            aria-label="GitHub"
            className={buttonVariants({
              variant: "outline",
              className: "w-10 h-10 p-0 flex items-center justify-center shrink-0 rounded-xl hover:scale-105 transition-transform"
            })}
          >
            <GithubIcon className="w-5.5 h-5.5" />
          </a>
          <a
            href="https://www.linkedin.com/in/rajawatprateeksingh/"
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
            className={buttonVariants({
              variant: "outline",
              className: "w-10 h-10 p-0 flex items-center justify-center shrink-0 rounded-xl hover:scale-105 transition-transform"
            })}
          >
            <LinkedinIcon className="w-5.5 h-5.5" />
          </a>
        </div>

        {/* Interactive Terminal card */}
        <div 
          onClick={focusInput}
          className="bg-card/30 dark:bg-[#0d0d0d] border border-border/40 dark:border-[#242424] rounded-xl overflow-hidden shadow-xl font-mono text-sm cursor-text relative group min-h-[260px] flex flex-col"
        >
          {/* Top border ambient gradient glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Title bar */}
          <div className="flex items-center px-4 py-2.5 border-b border-border/40 dark:border-[#1e1e1e] bg-muted/20 dark:bg-[#111] select-none pointer-events-none shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="mx-auto text-xs text-muted-foreground/60 dark:text-[#555] truncate max-w-[180px] sm:max-w-none">interactive-zsh — RajawatPrateekSingh</span>
          </div>

          {/* Shell Output + Input (Scrollable Container) */}
          <div ref={terminalContainerRef} className="p-4 flex-1 overflow-y-auto space-y-2 max-h-[300px]">
            {history.map((line, index) => {
              if (line.type === "command") {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{line.text}</span>
                  </div>
                );
              }
              if (line.type === "system") {
                return (
                  <div key={index} className="text-emerald-500/80 font-semibold text-xs py-1">
                    {line.text}
                  </div>
                );
              }
              if (line.type === "error") {
                return (
                  <div key={index} className="text-red-400 text-xs font-semibold">
                    {line.text}
                  </div>
                );
              }
              return (
                <div key={index} className="pl-5 text-emerald-400/90 font-medium space-y-0.5">
                  <p>{line.text}</p>
                </div>
              );
            })}
          </div>

          {/* Active Terminal Input Field */}
          <form onSubmit={handleCommandSubmit} className="p-4 pt-0 flex items-center gap-2 shrink-0 select-none">
            <span className="text-emerald-400 font-bold">{currentPath} ❯</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-emerald-400 caret-emerald-400 font-semibold animate-blink-placeholder"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="type commands here..."
            />
          </form>
        </div>
      </motion.div>
    </section>
  );
}
