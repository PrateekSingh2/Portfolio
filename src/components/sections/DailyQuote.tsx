"use client";

import * as React from "react";

interface QuoteItem {
  quote: string;
  author: string;
}

const QUOTES: QuoteItem[] = [
  {
    quote: "A man who is master of patience is master of everything else.",
    author: "George Savile",
  },
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  {
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
  {
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    quote: "Premature optimization is the root of all evil.",
    author: "Donald E. Knuth",
  },
  {
    quote: "The function of good software is to make the complex appear simple.",
    author: "Grady Booch",
  },
  {
    quote: "Controlling complexity is the essence of computer programming.",
    author: "Brian Kernighan",
  },
  {
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
  },
  {
    quote: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
  },
  {
    quote: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
  },
  {
    quote: "Software is a great combination between artistry and engineering.",
    author: "Bill Gates",
  },
  {
    quote: "Walking on water and developing software from a specification are easy if both are frozen.",
    author: "Edward V. Berard",
  },
  {
    quote: "The most important property of a program is whether it accomplishes the intention of its user.",
    author: "C.A.R. Hoare",
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
];

export function DailyQuote() {
  const [dailyQuote, setDailyQuote] = React.useState<QuoteItem>(QUOTES[0]);

  React.useEffect(() => {
    // Dynamic daily quote calculation advancing every 24 hours at midnight
    const now = new Date();
    const dayNumber = Math.floor(
      (now.getTime() - now.getTimezoneOffset() * 60000) / 86400000
    );
    const selected = QUOTES[Math.abs(dayNumber) % QUOTES.length];
    setDailyQuote(selected);
  }, []);

  return (
    <div className="py-10 px-4 max-w-3xl mx-auto w-full relative">
      <div className="relative rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-xs border border-black/10 dark:border-white/10 p-6 sm:p-9 shadow-none">
        {/* Faint watermark quotation mark safely positioned without clipping */}
        <svg
          className="absolute left-5 sm:left-7 top-4 sm:top-5 w-20 h-20 sm:w-24 sm:h-24 text-black/[0.04] dark:text-white/[0.04] pointer-events-none select-none z-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <div className="relative z-10 pl-1">
          <p className="text-base sm:text-lg font-mono italic text-foreground/90 leading-relaxed tracking-tight">
            &ldquo;{dailyQuote.quote}&rdquo;
          </p>

          <p className="text-right text-xs sm:text-sm font-mono italic text-muted-foreground/70 mt-3.5 sm:mt-4">
            &mdash; {dailyQuote.author}
          </p>
        </div>
      </div>
    </div>
  );
}
