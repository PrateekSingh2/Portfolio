"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  Send,
  CheckCircle2,
  ArrowRight,
  Check,
  MessageSquare,
  Copy,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Footer } from "@/components/layout/Footer";
import { Spotlight } from "@/components/ui/Spotlight";

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function ContactPage() {
  const EMAIL_ID = "prateeksinghrajawat2006@gmail.com";
  const LINKEDIN_URL = "https://linkedin.com/in/prateeksingh";

  const { resolvedTheme } = useTheme();
  const calTheme = resolvedTheme === "dark" ? "dark" : "light";

  const calUsername = "prateeksingh";
  const [showScheduler, setShowScheduler] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lock background scroll when popup is open
  useEffect(() => {
    if (showScheduler) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showScheduler]);

  // Contact Form State
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(EMAIL_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = encodeURIComponent(
      formState.subject || `Direct Message from ${formState.name}`,
    );
    const body = encodeURIComponent(
      `Hello Prateek,\n\n${formState.message}\n\n---\nSender: ${formState.name}\nEmail: ${formState.email}`,
    );

    // Open user's email client with pre-filled message details
    window.location.href = `mailto:${EMAIL_ID}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col justify-between font-sans transition-colors duration-300">
      <Spotlight />

      {/* Main Content Container matching Homepage width (max-w-3xl) */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-24 relative z-10 flex-grow space-y-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
            Get in Touch
          </h1>
        </div>

        {/* SECTION 1: Send a Direct Message Form (AT TOP) */}
        <section className="bg-card/80 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-border/60">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold font-sans text-foreground">
              Send a Direct Message
            </h2>
          </div>

          {isSubmitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-sans text-foreground">
                Message Sent!
              </h3>
              <p className="text-xs font-sans text-muted-foreground max-w-sm mx-auto">
                Thank you for reaching out. I will get back to your email as
                soon as possible.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 rounded-xl bg-secondary text-xs font-mono text-secondary-foreground border border-border hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 font-sans text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1.5">
                    Your name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name XYZ"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-background/80 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1.5">
                    Email address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="yourmail@xyz.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-background/80 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Intro call / Engineering Opportunity"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-background/80 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1.5">
                  Additional notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Leave a feedback, career opportunity, or a simple hello etc."
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-background/80 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Separator between Direct Message & Cal.com Booking */}
        <div className="flex items-center justify-center gap-4 py-1 my-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-border" />
          <span className="text-xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
            OR
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border to-border" />
        </div>

        {/* SECTION 2: Cal.com Meeting */}
        <section className="space-y-6">
          {/* "Let's Connect" Card */}
          <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-md shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-sans text-foreground tracking-tight leading-none mb-1">
                  Let&apos;s Connect
                </h2>
                <p className="text-sm font-sans font-semibold text-primary">
                  Quick Sync
                </p>
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-3 font-sans text-sm text-foreground/90 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[3]" />
                <span>Skip back-and-forth emails</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[3]" />
                <span>Discuss opportunities &amp; ideas</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[3]" />
                <span>Quick 15-minute call</span>
              </li>
            </ul>

            {/* Book Your Slot Button */}
            <button
              onClick={() => setShowScheduler(true)}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-base font-sans transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Your Slot</span>
              <ArrowRight className="w-5 h-5 text-primary-foreground" />
            </button>

            <p className="text-xs font-sans text-muted-foreground text-center mt-3.5">
              Pick your time &bull; Let&apos;s chat
            </p>
          </div>
        </section>
      </main>

      {/* Fullscreen Overlay Popup matching exact screenshot layout */}
      {showScheduler && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowScheduler(false)}
        >
          {/* Mobile Top Close Header Bar */}
          <div className="w-full max-w-[960px] flex items-center justify-between pb-2.5 px-1 sm:hidden">
            <span className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Book a Meeting
            </span>
            <button
              onClick={() => setShowScheduler(false)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white font-mono text-xs font-bold border border-white/20 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>

          {/* Top-Right Screen Close X Icon (for desktop/tablet) */}
          <button
            onClick={() => setShowScheduler(false)}
            className="hidden sm:flex fixed top-5 right-5 sm:top-7 sm:right-7 z-50 text-white/80 hover:text-white p-2 transition-all hover:scale-110 cursor-pointer"
            aria-label="Close popup"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>

          {/* Centered Cal.com Schedule Dialog Box */}
          <div
            className="relative w-full max-w-[960px] h-[82vh] sm:h-[620px] max-h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-border/60 bg-card touch-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://cal.com/${calUsername}?embed=true&theme=${calTheme}`}
              title="Cal.com Scheduler"
              className="w-full h-full border-0 rounded-2xl bg-card touch-auto"
              allow="camera; microphone; autoplay; clipboard-write; encrypted-media; fullscreen"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
