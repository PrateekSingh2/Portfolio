"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Calendar,
  Clock,
  Copy,
  Check,
  Share2,
  List,
  FileText,
  ChevronDown,
  ChevronUp,
  ListOrdered,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-sql";
import { Footer } from "@/components/layout/Footer";
import { BlogPost } from "@/lib/blogs";
import { ResilienceArchitectureDiagram, MermaidViewer } from "./BlogDiagrams";

interface CodeToken {
  type?: string;
  content: string;
}

function tokenizeToLines(code: string, grammar?: Prism.Grammar): CodeToken[][] {
  if (!grammar) {
    return code.split("\n").map((line) => [{ content: line }]);
  }

  const tokens = Prism.tokenize(code, grammar);
  const lines: CodeToken[][] = [[]];

  function processToken(token: string | Prism.Token, parentType?: string) {
    if (typeof token === "string") {
      const parts = token.split("\n");
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) lines.push([]);
        if (parts[i]) {
          lines[lines.length - 1].push({ type: parentType, content: parts[i] });
        }
      }
    } else if (Array.isArray(token.content)) {
      for (const sub of token.content) {
        processToken(sub, token.type || parentType);
      }
    } else if (typeof token.content === "string") {
      const parts = token.content.split("\n");
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) lines.push([]);
        if (parts[i]) {
          lines[lines.length - 1].push({ type: token.type || parentType, content: parts[i] });
        }
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processToken(token.content as any, token.type || parentType);
    }
  }

  for (const token of tokens) {
    processToken(token);
  }

  return lines;
}

function getTokenClass(type?: string): string {
  switch (type) {
    case "keyword":
    case "builtin":
    case "boolean":
      return "text-[#cf222e] dark:text-[#ff7b72] font-semibold";
    case "function":
    case "class-name":
      return "text-[#8250df] dark:text-[#d2a8ff]";
    case "string":
    case "char":
    case "attr-value":
      return "text-[#0a3069] dark:text-[#a5d6ff]";
    case "number":
      return "text-[#0550ae] dark:text-[#79c0ff]";
    case "comment":
    case "prolog":
    case "doctype":
    case "cdata":
      return "text-[#57606a] dark:text-[#8b949e] italic";
    case "operator":
      return "text-[#cf222e] dark:text-[#79c0ff]";
    case "punctuation":
      return "text-[#57606a] dark:text-[#8b949e]";
    case "variable":
    case "property":
    case "parameter":
      return "text-[#24292f] dark:text-[#e6edf3]";
    default:
      return "text-[#24292f] dark:text-[#e6edf3]";
  }
}

// Code block with Copy button, line numbers, language tag, title, and theme support
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CodeBlock({ className, children, node, inline, ...props }: any) {
  const [copied, setCopied] = React.useState(false);
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);

  const rawCodeString = String(children || "").replace(/\n$/, "");

  // Parse language & title
  let lang = "";
  let title = "";

  const rawClass = className || "";
  const match = /language-([^\s]+)/.exec(rawClass);
  if (match) {
    const rawLang = match[1];
    if (rawLang.includes(":")) {
      const [l, ...rest] = rawLang.split(":");
      lang = l;
      title = decodeURIComponent(rest.join(":"));
    } else {
      lang = rawLang;
    }
  }

  const meta: string = node?.data?.meta || "";
  if (meta) {
    const titleMatch =
      /title=["']([^"']+)["']/.exec(meta) || /filename=["']([^"']+)["']/.exec(meta);
    if (titleMatch) {
      title = titleMatch[1];
    } else if (meta.startsWith(":")) {
      title = meta.slice(1).trim();
    } else if (!title && meta.trim() && !meta.includes("=")) {
      title = meta.trim();
    }
  }

  // Handle diagram / architecture requests
  const lowerLang = lang.toLowerCase();
  if (
    lowerLang === "diagram" ||
    lowerLang === "architecture" ||
    (lowerLang === "mermaid" && title?.toLowerCase().includes("resilience"))
  ) {
    return <ResilienceArchitectureDiagram />;
  }
  if (lowerLang === "mermaid") {
    return <MermaidViewer code={rawCodeString} title={title} />;
  }

  // If language is not specified or is plain text / questions:
  // "if its normal text or question like, then make it .md extension."
  if (!lang || lowerLang === "text" || lowerLang === "txt") {
    lang = "md";
  }

  // If no title provided for md/questions:
  if (!title) {
    if (lang === "md" || lang === "markdown") {
      title = "question.md";
    }
  }

  const languageLabels: Record<string, string> = {
    py: "Python",
    python: "Python",
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    sh: "Bash",
    bash: "Bash",
    shell: "Bash",
    json: "JSON",
    md: "Markdown",
    markdown: "Markdown",
    sql: "SQL",
    yaml: "YAML",
    yml: "YAML",
    css: "CSS",
    html: "HTML",
    cpp: "C++",
    c: "C",
  };

  const displayLanguage =
    languageLabels[lang.toLowerCase()] || (lang ? lang.toUpperCase() : "Markdown");

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isInline = inline || (!match && !rawCodeString.includes("\n"));
  if (isInline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-muted/60 text-primary font-mono text-[13px] border border-black/5 dark:border-white/5"
        {...props}
      >
        {children}
      </code>
    );
  }

  const grammar =
    Prism.languages[lang.toLowerCase()] ||
    (lang.toLowerCase() === "md" ? Prism.languages.markdown : undefined);
  const lines = tokenizeToLines(rawCodeString, grammar);

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-[#d0d7de] dark:border-white/10 bg-[#f0f5fa] dark:bg-[#0d121c] text-[#24292f] dark:text-[#e6edf3] shadow-xs max-w-full transition-colors">
      {/* Code Header Bar matching Image 1 */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#d8e2ec] dark:border-white/10 bg-[#e6eef6] dark:bg-[#151b26] text-xs font-mono select-none gap-2">
        {/* Left: Chevron Down + Language */}
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm shrink-0">
          <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="truncate max-w-[90px] sm:max-w-none">{displayLanguage}</span>
        </div>

        {/* Center: Title of the snippet */}
        <div className="truncate max-w-[45%] sm:max-w-[50%] px-1 sm:px-2 text-center text-[11px] sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          {title}
        </div>

        {/* Right: Toggle line numbers & Copy button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowLineNumbers((prev) => !prev)}
            type="button"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            type="button"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Code Body with strict non-breaking horizontal scroll & line-by-line gutter */}
      <div className="overflow-x-auto w-full p-4">
        <div className="table min-w-full font-mono text-xs sm:text-[13px] leading-relaxed">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              {showLineNumbers && (
                <span className="table-cell text-right pr-4 select-none text-slate-400/80 dark:text-slate-600 font-mono text-xs w-8 sm:w-10">
                  {idx + 1}
                </span>
              )}
              <span className="table-cell whitespace-pre font-mono text-xs sm:text-[13px] leading-relaxed">
                {line.length === 0 ? (
                  "\u00A0"
                ) : (
                  line.map((tok, tIdx) => (
                    <span key={tIdx} className={getTokenClass(tok.type)}>
                      {tok.content}
                    </span>
                  ))
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slugify heading for anchor tags
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function BlogArticleClient({ post }: { post: BlogPost }) {
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isContentExpanded, setIsContentExpanded] = React.useState(true);
  const [isMobileTocOpen, setIsMobileTocOpen] = React.useState(false);
  const tocContainerRef = React.useRef<HTMLDivElement>(null);

  // Total word count calculation
  const wordCount = React.useMemo(() => {
    if (post.wordCount) return post.wordCount;
    if (!post.content) return 0;
    return post.content.trim().split(/\s+/).filter(Boolean).length;
  }, [post.content, post.wordCount]);

  // Extract Table of Contents from markdown content
  const tableOfContents = React.useMemo(() => {
    if (!post?.content) return [];
    const headings: { level: number; text: string; id: string }[] = [];
    const lines = post.content.split("\n");

    for (const line of lines) {
      const match = /^(#{2,3})\s+(.+)$/.exec(line);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim().replace(/\*\*/g, "").replace(/`/g, "");
        const id = slugify(text);
        headings.push({ level, text, id });
      }
    }
    return headings;
  }, [post?.content]);

  // Group headings into parent H2 and internal H3 subheadings
  const groupedHeadings = React.useMemo(() => {
    interface HeadingGroup {
      parent: { level: number; text: string; id: string };
      subheadings: { level: number; text: string; id: string }[];
    }
    const groups: HeadingGroup[] = [];
    let currentGroup: HeadingGroup | null = null;

    for (const item of tableOfContents) {
      if (item.level === 2) {
        currentGroup = { parent: item, subheadings: [] };
        groups.push(currentGroup);
      } else if (item.level === 3) {
        if (currentGroup) {
          currentGroup.subheadings.push(item);
        } else {
          groups.push({ parent: item, subheadings: [] });
        }
      }
    }
    return groups;
  }, [tableOfContents]);

  // Track active heading on scroll
  React.useEffect(() => {
    if (tableOfContents.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = tableOfContents.length - 1; i >= 0; i--) {
        const elem = document.getElementById(tableOfContents[i].id);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveSection(tableOfContents[i].id);
          return;
        }
      }
      if (tableOfContents[0]) {
        setActiveSection(tableOfContents[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  // Auto-scroll TOC container as user scrolls through the article
  React.useEffect(() => {
    if (!isContentExpanded || !activeSection) return;

    const timer = setTimeout(() => {
      const container = tocContainerRef.current;
      if (!container) return;

      // If at the very first heading, smoothly scroll container to top
      if (tableOfContents.length > 0 && activeSection === tableOfContents[0].id) {
        container.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const activeLink = container.querySelector<HTMLElement>(
        `[href="#${activeSection}"]`
      );
      if (!activeLink) return;

      const containerRect = container.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const relativeTop = linkRect.top - containerRect.top;
      const relativeBottom = linkRect.bottom - containerRect.top;

      // If active item is near or outside the visible bounds of the TOC container
      if (relativeTop < 35 || relativeBottom > containerRect.height - 35) {
        const scrollOffset =
          relativeTop - containerRect.height / 2 + linkRect.height / 2;
        container.scrollBy({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [activeSection, isContentExpanded, tableOfContents]);

  // When Share button pressed, directly copy the article link
  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-20 sm:pt-28 px-3.5 sm:px-6 font-sans overflow-x-clip">
      <div className="max-w-5xl mx-auto w-full">
        {/* Breadcrumb Path: Home / blog / slug (clickable except current slug) */}
        <div className="flex items-center justify-between mb-6 gap-2 sm:gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono text-muted-foreground min-w-0 flex-1 overflow-hidden"
          >
            <Link
              href="/"
              className="hover:text-foreground transition-colors hover:underline shrink-0"
            >
              Home
            </Link>
            <span className="text-muted-foreground/50 shrink-0">/</span>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors hover:underline shrink-0"
            >
              blog
            </Link>
            <span className="text-muted-foreground/50 shrink-0">/</span>
            <span className="text-foreground font-semibold truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs md:max-w-md">
              {post.slug}
            </span>
          </nav>

          {/* Share Article (Direct copy link with feedback) */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs font-mono text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs shrink-0"
            title="Copy article link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Post Hero Header */}
        <header className="mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-sans leading-tight sm:leading-snug break-words mb-4 sm:mb-5">
            {post.title}
          </h1>

          {/* Well-Organized Author & Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs font-sans">
            {/* Author Profile on Left */}
            <Link
              href="/#hero"
              className="inline-flex items-center gap-2 group hover:opacity-90 transition-opacity w-fit"
              title="View author profile"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/15 relative">
                <Image
                  src={post.authorAvatar || "/images/profile.png"}
                  alt={post.author}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-[13px]">
                {post.author}
              </span>
            </Link>

            {/* Structured Metadata Badges on Right */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-muted-foreground">
              {/* Published Date */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.07] shrink-0">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                <span>{post.publishedAt}</span>
              </span>

              {/* Reading Time */}
              {post.readingTime && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.07] shrink-0">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                  <span>{post.readingTime.replace(/\s*read\s*/i, "").trim()}</span>
                </span>
              )}

              {/* Word Count */}
              {wordCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-medium shrink-0">
                  <FileText className="w-3.5 h-3.5 text-sky-500" />
                  <span>{wordCount.toLocaleString()} words</span>
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Mobile / Tablet Collapsible Table of Contents (< lg) */}
        {groupedHeadings.length > 0 && (
          <div className="block lg:hidden mb-6 sm:mb-8 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-3 font-sans">
            <button
              type="button"
              onClick={() => setIsMobileTocOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-expanded={isMobileTocOpen}
            >
              <div className="flex items-center gap-2">
                <List className="w-3.5 h-3.5 text-primary" />
                <span>On this page ({tableOfContents.length} sections)</span>
              </div>
              {isMobileTocOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {isMobileTocOpen && (
              <nav className="mt-2.5 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.06] space-y-1 max-h-64 overflow-y-auto pr-1">
                {groupedHeadings.map((group) => {
                  const isParentActive = activeSection === group.parent.id;
                  return (
                    <div key={group.parent.id} className="space-y-0.5">
                      <a
                        href={`#${group.parent.id}`}
                        onClick={() => setIsMobileTocOpen(false)}
                        className={`block py-1 pl-2 text-xs font-medium rounded-md transition-colors ${
                          isParentActive
                            ? "text-primary font-bold bg-primary/10"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {group.parent.text}
                      </a>
                      {group.subheadings.length > 0 && (
                        <div className="pl-3 space-y-0.5">
                          {group.subheadings.map((sub) => (
                            <a
                              key={sub.id}
                              href={`#${sub.id}`}
                              onClick={() => setIsMobileTocOpen(false)}
                              className={`block py-0.5 pl-2 text-[11px] rounded-sm transition-colors ${
                                activeSection === sub.id
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground/80 hover:text-foreground"
                              }`}
                            >
                              • {sub.text}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            )}
          </div>
        )}

        {/* Two-Column Layout: Main Content + Sticky Expandable Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 items-start relative">
          {/* Main Markdown Article Column */}
          <main className="min-w-0 prose dark:prose-invert max-w-none prose-neutral font-sans leading-relaxed text-foreground/90 pb-16">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Responsive Image rendering at any position in the article without invalid p nesting
                img({ src, alt }) {
                  if (!src) return null;
                  return (
                    <span className="block my-6 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-sm">
                      <img
                        src={src}
                        alt={alt || "Article illustration"}
                        className="w-full h-auto object-cover max-h-[520px] select-none rounded-t-2xl block"
                        loading="lazy"
                      />
                      {alt && (
                        <span className="block p-2.5 text-center text-xs font-mono text-muted-foreground bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5">
                          {alt}
                        </span>
                      )}
                    </span>
                  );
                },
                h2({ children }) {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h2
                      id={id}
                      className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-foreground mt-8 mb-4 pt-4 border-t border-black/[0.05] dark:border-white/[0.05] scroll-mt-24 group flex items-center gap-2 break-words"
                    >
                      <span>{children}</span>
                      <a
                        href={`#${id}`}
                        className="opacity-0 group-hover:opacity-100 text-primary text-sm font-mono transition-opacity shrink-0"
                        aria-label="Link to section"
                      >
                        #
                      </a>
                    </h2>
                  );
                },
                h3({ children }) {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h3
                      id={id}
                      className="text-lg sm:text-xl font-bold font-sans text-foreground mt-6 mb-3 scroll-mt-24 break-words"
                    >
                      {children}
                    </h3>
                  );
                },
                p({ children }) {
                  return (
                    <div className="text-sm sm:text-[15px] text-foreground/80 font-sans leading-relaxed my-3.5 break-words">
                      {children}
                    </div>
                  );
                },
                ul({ children }) {
                  return (
                    <ul className="list-disc list-outside pl-5 space-y-1.5 text-sm sm:text-[15px] text-foreground/80 my-3.5 font-sans">
                      {children}
                    </ul>
                  );
                },
                ol({ children }) {
                  return (
                    <ol className="list-decimal list-outside pl-5 space-y-1.5 text-sm sm:text-[15px] text-foreground/80 my-3.5 font-sans">
                      {children}
                    </ol>
                  );
                },
                li({ children }) {
                  return <li className="leading-relaxed">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-primary pl-4 py-1 my-4 italic text-muted-foreground bg-primary/5 rounded-r-lg">
                      {children}
                    </blockquote>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-6 rounded-xl border border-black/10 dark:border-white/10 shadow-xs">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return (
                    <thead className="bg-muted/40 font-mono text-xs uppercase tracking-wider text-foreground border-b border-black/10 dark:border-white/10">
                      {children}
                    </thead>
                  );
                },
                tbody({ children }) {
                  return (
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-sans">
                      {children}
                    </tbody>
                  );
                },
                tr({ children }) {
                  return (
                    <tr className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                      {children}
                    </tr>
                  );
                },
                th({ children }) {
                  return <th className="p-3 font-bold">{children}</th>;
                },
                td({ children }) {
                  return <td className="p-3 text-foreground/80">{children}</td>;
                },
                pre({ children }) {
                  return <>{children}</>;
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code(props: any) {
                  return <CodeBlock {...props} />;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </main>

          {/* Sticky Expandable Table of Contents Side Panel */}
          <aside className="hidden lg:block sticky top-24 self-start w-full font-sans">
            <div className="p-4 rounded-2xl border border-black/[0.07] dark:border-white/[0.08] bg-white/30 dark:bg-[#0c1017]/40 backdrop-blur-md shadow-xs max-h-[calc(100vh-7.5rem)] flex flex-col">
              {/* Expand / Collapse Header Button with Chevron Up/Down */}
              <button
                type="button"
                onClick={() => setIsContentExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                aria-expanded={isContentExpanded}
              >
                <div className="flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5 text-primary" />
                  <span>Contents</span>
                </div>
                {isContentExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Collapsible Content List with internal scrollbar & auto-scroll */}
              {isContentExpanded && (
                <div
                  ref={tocContainerRef}
                  className="mt-3 pt-2.5 border-t border-black/[0.05] dark:border-white/[0.05] overflow-y-auto pr-1 flex-1 scroll-smooth"
                >
                  {groupedHeadings.length > 0 ? (
                    <nav className="space-y-1">
                      {groupedHeadings.map((group) => {
                        const isDirectParentActive = activeSection === group.parent.id;
                        const isSubActive = group.subheadings.some(
                          (sub) => sub.id === activeSection
                        );
                        const isGroupActive = isDirectParentActive || isSubActive;

                        return (
                          <div key={group.parent.id} className="space-y-0.5">
                            {/* Main Heading (H2) */}
                            <a
                              href={`#${group.parent.id}`}
                              className={`block py-1.5 pl-2.5 transition-all duration-150 border-l-2 text-[13px] leading-snug rounded-r-md ${
                                isDirectParentActive
                                  ? "border-primary text-primary font-semibold bg-primary/5"
                                  : isGroupActive
                                  ? "border-primary/50 text-foreground font-medium"
                                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                              }`}
                            >
                              {group.parent.text}
                            </a>

                            {/* Internal Subheadings (H3): only expand when parent group is active/being read */}
                            {isGroupActive && group.subheadings.length > 0 && (
                              <div className="pl-3.5 border-l border-black/5 dark:border-white/5 ml-2.5 my-1 space-y-0.5">
                                {group.subheadings.map((sub) => {
                                  const isCurrentSubActive = activeSection === sub.id;
                                  return (
                                    <a
                                      key={sub.id}
                                      href={`#${sub.id}`}
                                      className={`block py-1 pl-2 transition-all duration-150 border-l-2 text-xs leading-snug rounded-r-sm ${
                                        isCurrentSubActive
                                          ? "border-primary text-primary font-semibold bg-primary/5"
                                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/20"
                                      }`}
                                    >
                                      {sub.text}
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </nav>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No section headings found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
