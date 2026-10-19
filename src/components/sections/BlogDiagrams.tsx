"use client";

import * as React from "react";
import {
  Smartphone,
  Server,
  Cpu,
  CheckCircle2,
  Layers,
  Database,
  ArrowDown,
  Workflow,
  Sparkles,
  ShieldAlert,
  Clock,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Visual System Architecture Diagram Component
 * Renders an enterprise-grade, theme-aware responsive diagram for the 
 * Third-Party Resilience & Telemetry challenge.
 */
export function ResilienceArchitectureDiagram() {
  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f8fafc] dark:bg-[#0c1017] overflow-hidden shadow-sm transition-colors">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <Workflow className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
            System Architecture: Multi-Model Resilience & Telemetry
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          High Availability & Fault Tolerant
        </div>
      </div>

      {/* Diagram Canvas */}
      <div className="p-4 sm:p-6 flex flex-col items-center">
        {/* Step 1: Client Request */}
        <div className="flex flex-col items-center max-w-sm w-full">
          <div className="px-5 py-2.5 rounded-xl border border-sky-300 dark:border-sky-500/30 bg-sky-50/80 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 shadow-xs flex items-center gap-3 w-full justify-center">
            <Smartphone className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div className="text-center">
              <span className="font-mono text-xs sm:text-sm font-bold block">
                [Client Request]
              </span>
              <span className="text-[11px] text-sky-700/80 dark:text-sky-300/80">
                Web App / Mobile / API Consumer
              </span>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex flex-col items-center my-1 text-slate-400 dark:text-slate-500">
            <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-4 h-4 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Step 2: API Gateway Layer */}
        <div className="w-full max-w-2xl">
          <div className="p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121622] shadow-xs text-foreground">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs sm:text-sm font-bold tracking-tight">
                  API Gateway & Ingestion Layer
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-muted-foreground">
                Edge Ingress
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-muted-foreground">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                • TLS Termination
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                • Token Authentication & Rate Limiting
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                • Request Routing & Upstream Validation
              </span>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex flex-col items-center my-1 text-slate-400 dark:text-slate-500">
            <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-4 h-4 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Step 3: Core Resilience Middleware */}
        <div className="w-full max-w-2xl">
          <div className="p-4 rounded-xl border-2 border-purple-300 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-200 dark:border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
                <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-mono text-xs sm:text-sm font-bold">
                  Resilience & Proxy Middleware
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-200/60 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-semibold">
                Core Fault Handler
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#121622]/90 border border-purple-100 dark:border-purple-500/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-800 dark:text-purple-300 font-mono mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Circuit Breaker</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Hystrix / Resilience4j pattern. Immediately fail fast when model outage exceeds threshold.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#121622]/90 border border-purple-100 dark:border-purple-500/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-800 dark:text-purple-300 font-mono mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>Exponential Backoff</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Full jitter retry schedule preventing thundering herd load on recovering providers.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#121622]/90 border border-purple-100 dark:border-purple-500/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-800 dark:text-purple-300 font-mono mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Error Classifier</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Differentiates 4xx (client mistake) from 5xx (AI provider down) and strips internal stack traces.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Branching Lines */}
        <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mt-2 mb-1">
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 text-center">
              (Success / User Error)
            </span>
            <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-4 h-4 -mt-1 text-emerald-500" />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 text-center">
              (Failure Telemetry)
            </span>
            <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-4 h-4 -mt-1 text-amber-500" />
          </div>
        </div>

        {/* Bottom Dual Destinations */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Destination: User Response */}
          <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 mb-2 pb-2 border-b border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-xs sm:text-sm font-bold">
                  User-Friendly Return
                </span>
              </div>
              <ul className="space-y-1.5 text-[11px] sm:text-xs text-muted-foreground font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500">✔</span>
                  <span>Clean 4xx status for invalid prompts or exhausted quotas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500">✔</span>
                  <span>Categorized 5xx fallback message on provider capacity limit</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500">✔</span>
                  <span>Actionable guidance without leaking raw backend traces</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/60 dark:border-emerald-500/10 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
              ⚡ Low Latency Synchronous Path (&lt; 40ms)
            </div>
          </div>

          {/* Right Destination: Telemetry Queue + Storage */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 mb-1">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-mono text-xs sm:text-sm font-bold">
                  Asynchronous Queue (AWS SQS)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                Decoupled event queue absorbs burst traffic; logs failures asynchronously without degrading user response speed.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 -my-1.5" />
            </div>

            <div className="p-3 rounded-xl border border-indigo-300 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 mb-1">
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono text-xs sm:text-sm font-bold">
                  Centralized Log Sink & Metrics
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                OpenTelemetry Collector &rarr; Loki / CloudWatch dashboards with automated alerts when provider error threshold triggers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Mermaid Diagram Renderer
 * Dynamically evaluates Mermaid markup in browser and syncs with NextThemes.
 */
export function MermaidViewer({ code, title }: { code: string; title?: string }) {
  const [svg, setSvg] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    let isMounted = true;
    async function renderMermaid() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-geist-mono), monospace",
        });

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        if (isMounted) {
          setSvg(svg);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Mermaid render error:", err);
          setError("Failed to render diagram");
        }
      }
    }

    renderMermaid();
    return () => {
      isMounted = false;
    };
  }, [code, theme]);

  if (error) {
    return (
      <div className="my-6 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive font-mono text-xs">
        {error}
      </div>
    );
  }

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f8fafc] dark:bg-[#0c1017] overflow-hidden shadow-xs">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.03]">
          <Workflow className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-xs font-semibold text-foreground">
            {title}
          </span>
        </div>
      )}
      <div
        className="p-4 sm:p-6 overflow-x-auto flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
