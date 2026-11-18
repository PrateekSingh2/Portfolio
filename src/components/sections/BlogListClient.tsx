"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Tag, X, FileText } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { BlogPost } from "@/lib/blogs";

export function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();
  const [posts] = React.useState<BlogPost[]>(initialPosts);

  // Command Palette Popup Modal State
  const [openSearch, setOpenSearch] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [expandedTags, setExpandedTags] = React.useState<
    Record<string, boolean>
  >({});

  const modalInputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const toggleTags = (slug: string) => {
    setExpandedTags((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const closeModal = React.useCallback(() => {
    setOpenSearch(false);
    setModalSearch("");
    setSelectedIndex(0);
  }, []);

  // Global Ctrl + K / Cmd + K keyboard listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch((prev) => {
          if (prev) {
            setModalSearch("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      }
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  // Auto focus search input when modal opens
  React.useEffect(() => {
    if (openSearch) {
      const timer = setTimeout(() => {
        modalInputRef.current?.focus();
        modalInputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [openSearch]);

  // Filter posts in modal search
  const modalFilteredPosts = React.useMemo(() => {
    const q = modalSearch.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags?.some((t) => t.toLowerCase().includes(q)) ||
        post.author.toLowerCase().includes(q),
    );
  }, [posts, modalSearch]);

  // Auto-scroll selected item into view when navigating with Arrow keys
  React.useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation within the search dialog
  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < modalFilteredPosts.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : modalFilteredPosts.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = modalFilteredPosts[selectedIndex];
      if (selected) {
        setOpenSearch(false);
        router.push(`/blog/${selected.slug}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-24 sm:pt-28 px-4 font-sans">
      <div className="max-w-3xl mx-auto w-full">
        {/* ================================================================= */}
        {/* Top Header: Heading "Blog Posts" with Small Compact Search Button */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
          <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-foreground">
            Blog Posts
          </h1>

          {/* Compact search button with Ctrl + K shortcut badge */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] text-xs font-mono text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs group"
            title="Search blog posts (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 group-hover:text-primary transition-colors shrink-0" />
            <span className="hidden sm:inline text-muted-foreground">
              Type to search...
            </span>
            <span className="inline sm:hidden">Search</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.06] text-[10px] text-muted-foreground font-mono">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* ================================================================= */}
        {/* Article List directly placed on the page                          */}
        {/* ================================================================= */}
        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <React.Fragment key={post.slug}>
                <article className="py-2">
                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-foreground hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {/* Author Avatar, Name, Published Date */}
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2 mb-2.5 text-xs sm:text-[13px] font-sans text-muted-foreground">
                    <Link
                      href="/#hero"
                      className="flex items-center gap-1.5 group hover:opacity-90 transition-opacity"
                      title="View author profile"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/15 relative">
                        <Image
                          src={post.authorAvatar || "/images/profile.png"}
                          alt={post.author}
                          width={20}
                          height={20}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="font-semibold text-sky-600 dark:text-sky-400 group-hover:underline">
                        {post.author}
                      </span>
                    </Link>
                    <span>•</span>
                    <span>published on {post.publishedAt}</span>
                    {post.readingTime && (
                      <>
                        <span>•</span>
                        <span>{post.readingTime} read</span>
                      </>
                    )}
                  </div>

                  {/* Desktop view (sm and up): clean excerpt without inline 'show more' */}
                  <p className="hidden sm:block text-[#64748b] dark:text-[#94a3b8] text-[15px] font-sans leading-relaxed mb-3.5 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Mobile view (< sm): truncated short description with 'show more' button */}
                  <div className="block sm:hidden mb-3 text-sm font-sans leading-relaxed text-[#64748b] dark:text-[#94a3b8]">
                    <span>
                      {post.excerpt.length > 105
                        ? `${post.excerpt.slice(0, 105).trim()}... `
                        : `${post.excerpt} `}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap cursor-pointer"
                    >
                      show more →
                    </Link>
                  </div>

                  {/* Bottom Row: Read More on left, Tags with +X pile on right */}
                  <div className="flex items-center justify-between text-xs sm:text-[13px] font-sans gap-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sky-600 dark:text-sky-400 font-semibold hover:underline shrink-0 flex items-center gap-1 group"
                    >
                      <span>Read Article</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>

                    {/* Mobile-optimized Tag row: show 1st tag + (+X) pile button */}
                    <div className="flex items-center gap-1.5 text-muted-foreground min-w-0 justify-end">
                      <Tag className="w-3.5 h-3.5 rotate-90 shrink-0 text-muted-foreground/70" />
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {expandedTags[post.slug] ? (
                            <>
                              <span>{post.tags.join(", ")}</span>
                              <button
                                type="button"
                                onClick={() => toggleTags(post.slug)}
                                className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                                title="Collapse tags"
                              >
                                collapse
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="truncate max-w-[130px] sm:max-w-none">
                                {post.tags[0]}
                              </span>
                              {post.tags.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => toggleTags(post.slug)}
                                  className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[11px] font-mono font-medium border border-black/15 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/10 text-foreground transition-colors cursor-pointer shrink-0"
                                  title={`View ${post.tags.length - 1} more tags`}
                                >
                                  +{post.tags.length - 1}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>

                {/* Subtle dashed divider line after each article */}
                <div className="border-b border-dashed border-neutral-300 dark:border-neutral-700/60 my-6 sm:my-8" />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground font-mono text-sm">
            No articles found.
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* Sleek, Featherlight Command Palette Modal (Ctrl + K)              */}
      {/* ================================================================= */}
      {openSearch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/75 backdrop-blur-xs flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in-0 duration-150"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-black/12 dark:border-white/12 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Minimalist Search Input Header */}
            <div className="flex items-center gap-3 px-3.5 py-3 border-b border-black/[0.08] dark:border-white/[0.08]">
              <Search className="w-4 h-4 text-muted-foreground/70 shrink-0 ml-1" />
              <input
                ref={modalInputRef}
                type="text"
                value={modalSearch}
                onChange={(e) => {
                  setModalSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleModalKeyDown}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              {modalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setModalSearch("");
                    setSelectedIndex(0);
                    modalInputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd
                onClick={closeModal}
                className="px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              >
                esc
              </kbd>
            </div>

            {/* Uncluttered Results List */}
            <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 font-sans">
              {modalFilteredPosts.length > 0 ? (
                modalFilteredPosts.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.slug}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        setOpenSearch(false);
                        router.push(`/blog/${item.slug}`);
                      }}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-black/[0.05] dark:bg-white/[0.08] text-foreground"
                          : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03] text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isSelected
                              ? "text-primary"
                              : "text-muted-foreground/60"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium truncate ${
                            isSelected
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-muted-foreground/60 hidden sm:inline">
                          {item.publishedAt}
                        </span>
                        {isSelected && (
                          <kbd className="px-1.5 py-0.5 rounded border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.08] text-[10px] font-mono text-foreground">
                            ↵
                          </kbd>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center font-mono text-xs text-muted-foreground">
                  No articles matching &ldquo;{modalSearch}&rdquo;
                </div>
              )}
            </div>

            {/* Featherlight Minimalist Footer */}
            <div className="px-3.5 py-2 border-t border-black/[0.06] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.015] flex items-center justify-between text-[11px] font-mono text-muted-foreground/60 select-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded bg-black/5 dark:bg-white/10 text-[9px]">
                    ↑
                  </kbd>
                  <kbd className="px-1 rounded bg-black/5 dark:bg-white/10 text-[9px]">
                    ↓
                  </kbd>{" "}
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 rounded bg-black/5 dark:bg-white/10 text-[9px]">
                    ↵
                  </kbd>{" "}
                  open
                </span>
              </div>
              <span className="text-[10px]">
                {modalFilteredPosts.length}{" "}
                {modalFilteredPosts.length === 1 ? "result" : "results"}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
