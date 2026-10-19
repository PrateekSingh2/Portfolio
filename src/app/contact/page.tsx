"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Send,
  CheckCircle2,
  ArrowRight,
  Check,
  MessageSquare,
  X,
  AlertCircle,
  Loader2,
  RefreshCw,
  Mail,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Footer } from "@/components/layout/Footer";
import { Spotlight } from "@/components/ui/Spotlight";

export default function ContactPage() {
  const EMAIL_ID = "prateeksinghrajawat2006@gmail.com";
  const WEB3FORMS_KEY =
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
    "1628d23c-3f03-4e1b-9e29-ebbf7d28fa00";

  const { resolvedTheme } = useTheme();
  const calTheme = resolvedTheme === "dark" ? "dark" : "light";

  const calUsername = "prateeksingh";
  const [showScheduler, setShowScheduler] = useState(false);

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerMailtoFallback = (payload?: typeof formState) => {
    const data = payload || formState;
    const subject = encodeURIComponent(
      data.subject || `Direct Message from ${data.name || "Portfolio Visitor"}`
    );
    const body = encodeURIComponent(
      `Hello Prateek,\n\n${data.message}\n\n---\nSender: ${data.name}\nEmail: ${data.email}`
    );
    window.location.href = `mailto:${EMAIL_ID}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const currentForm = { ...formState };

    try {
      // 1. Direct Web3Forms submission from the browser (passes Cloudflare security check 100%)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: currentForm.name,
          email: currentForm.email,
          subject:
            currentForm.subject || `Direct Portfolio Message from ${currentForm.name}`,
          message: currentForm.message,
          from_name: `${currentForm.name} (Portfolio Visitor)`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        setFormState({ name: "", email: "", subject: "", message: "" });

        // Save backup record to local file log (data/contact_messages.json)
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentForm),
        }).catch(() => {});
      } else {
        setErrorMessage(
          data.message || "Email dispatch error. You can click 'Send via Email Client' below."
        );
      }
    } catch (err) {
      console.error("Direct browser Web3Forms error:", err);

      // Fallback: send via local API route
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentForm),
        });
        const localData = await res.json();
        if (res.ok && localData.success) {
          setIsSubmitted(true);
          setFormState({ name: "", email: "", subject: "", message: "" });
          return;
        }
      } catch (localErr) {
        console.error("Local API fallback error:", localErr);
      }

      setErrorMessage(
        "Network connection error. Click 'Send via Email Client' below."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative overflow-hidden flex flex-col justify-between font-sans transition-colors duration-300">
      <Spotlight />

      {/* Main Content Container matching Homepage width (max-w-3xl) */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-24 relative z-10 flex-grow space-y-10">
        {/* Header with Title and "Book a free call" label button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-2">
              Get in Touch
            </h1>
            <p className="text-sm font-sans text-muted-foreground">
              Have a question, opportunity, or idea? Send me a direct message below.
            </p>
          </div>

          {/* Simple "Book a free call" label button */}
          <button
            type="button"
            onClick={() => setShowScheduler(true)}
            className="self-start sm:self-center inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/25 text-primary text-xs font-mono font-bold transition-all shadow-sm group cursor-pointer shrink-0 active:scale-95 hover:scale-[1.02]"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span>Book a free call</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Send a Direct Message Form - Simple Outline, No Inner Fill */}
        <section className="bg-transparent border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-none relative overflow-hidden">

          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-black/[0.08] dark:border-white/[0.08]">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans text-foreground">
                Send a Direct Message
              </h2>
              <p className="text-xs text-muted-foreground font-sans">
                Delivered straight to Prateek&apos;s inbox ({EMAIL_ID})
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-sans text-foreground">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs font-sans text-muted-foreground max-w-md mx-auto">
                  Thank you for reaching out. Your message has been delivered to{" "}
                  <span className="font-semibold text-foreground">{EMAIL_ID}</span>.
                  I will review it and get back to you shortly.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setErrorMessage(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-mono text-secondary-foreground border border-border transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Send Another Message</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 font-sans text-xs"
            >
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-2 font-sans">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">{errorMessage}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerMailtoFallback()}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive text-xs font-mono font-bold border border-destructive/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send via Email Client Instead</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1.5">
                    Your name <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-transparent border border-black/10 dark:border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1.5">
                    Email address <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-transparent border border-black/10 dark:border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Intro call / Engineering Opportunity / Project Collaboration"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-transparent border border-black/10 dark:border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1.5">
                  Message <span className="text-emerald-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Leave your message, feedback, or opportunity details here..."
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-transparent border border-black/10 dark:border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group/btn w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
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
