"use client";

import * as React from "react";
import { X, Square } from "lucide-react";

// ============================================================================
// 1. ACTIVE REAL PING COMPONENT
// ============================================================================
interface PacketInfo {
  seq: number;
  ip: string;
  time: number;
  ttl: number;
  bytes: number;
}

export function ActivePing({ rawHost }: { rawHost: string }) {
  const [packets, setPackets] = React.useState<PacketInfo[]>([]);
  const [hostInfo, setHostInfo] = React.useState<{
    host: string;
    ip: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isDone, setIsDone] = React.useState(false);
  const [isStopped, setIsStopped] = React.useState(false);

  const stopRef = React.useRef(false);

  React.useEffect(() => {
    let isMounted = true;
    stopRef.current = false;

    const runPing = async () => {
      const clean =
        rawHost
          .trim()
          .replace(/^https?:\/\//i, "")
          .replace(/\/.*$/, "") || "google.com";

      try {
        for (let seq = 1; seq <= 4; seq++) {
          if (stopRef.current || !isMounted) break;

          const res = await fetch("/api/terminal/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ host: clean }),
          });

          const data = await res.json();

          if (!isMounted || stopRef.current) break;

          if (!res.ok || data.error) {
            setError(
              data.error || `ping: cannot resolve ${clean}: Unknown host`,
            );
            setIsDone(true);
            return;
          }

          if (seq === 1) {
            setHostInfo({ host: data.host, ip: data.ip });
          }

          setPackets((prev) => [
            ...prev,
            {
              seq,
              ip: data.ip,
              time: data.time,
              ttl: data.ttl,
              bytes: data.bytes || 64,
            },
          ]);

          if (seq < 4) {
            // Realistic interval between sequential pings
            await new Promise((resolve) => setTimeout(resolve, 650));
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "unreachable";
          setError(`ping: sendto: Network probe error (${msg})`);
        }
      } finally {
        if (isMounted) {
          setIsDone(true);
        }
      }
    };

    runPing();

    return () => {
      isMounted = false;
      stopRef.current = true;
    };
  }, [rawHost]);

  const handleStop = () => {
    stopRef.current = true;
    setIsStopped(true);
    setIsDone(true);
  };

  const stats = React.useMemo(() => {
    if (packets.length === 0) return null;
    const times = packets.map((p) => p.time);
    const min = Math.min(...times).toFixed(2);
    const max = Math.max(...times).toFixed(2);
    const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
    return { min, max, avg, count: packets.length };
  }, [packets]);

  return (
    <div className="space-y-1.5 text-xs font-mono select-text leading-relaxed">
      {/* Header Line */}
      <div className="text-white/70 flex items-center justify-between">
        <span>
          PING {hostInfo ? `${hostInfo.host} (${hostInfo.ip})` : rawHost}: 56
          data bytes
        </span>
        {!isDone && (
          <button
            type="button"
            onClick={handleStop}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-colors cursor-pointer"
            title="Stop ping"
          >
            <Square className="w-2.5 h-2.5 fill-current" />
            <span>Stop (Ctrl+C)</span>
          </button>
        )}
      </div>

      {/* Packet Stream */}
      <div className="space-y-0.5 pl-1">
        {packets.map((pkt) => (
          <div
            key={pkt.seq}
            className="text-emerald-400/90 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {pkt.bytes} bytes from {pkt.ip}: icmp_seq={pkt.seq} ttl={pkt.ttl}{" "}
              time={pkt.time} ms
            </span>
          </div>
        ))}

        {!isDone && packets.length < 4 && !error && (
          <div className="text-white/30 text-[11px] animate-pulse flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Probing packet #{packets.length + 1}...</span>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && <div className="text-rose-400 pl-1 font-semibold">{error}</div>}

      {/* Summary Statistics Footer */}
      {stats && isDone && (
        <div className="pt-1.5 mt-1 border-t border-white/10 text-white/50 text-[11px] space-y-0.5">
          <div>--- {hostInfo?.host || rawHost} ping statistics ---</div>
          <div>
            {stats.count} packets transmitted, {stats.count} packets received,
            0.0% packet loss
            {isStopped ? " (interrupted by user)" : ""}
          </div>
          <div className="text-emerald-400/80 font-semibold">
            round-trip min/avg/max = {stats.min}/{stats.avg}/{stats.max} ms
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. ACTIVE REAL CURL COMPONENT
// ============================================================================
interface CurlResponseData {
  success: boolean;
  url: string;
  status: number;
  statusText: string;
  httpVersion: string;
  headers: Record<string, string>;
  contentType: string;
  body: string;
  isJson: boolean;
  durationMs: number;
  byteLength: number;
}

export function ActiveCurl({ rawUrl }: { rawUrl: string }) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<CurlResponseData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const runCurl = async () => {
      try {
        const res = await fetch("/api/terminal/curl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: rawUrl }),
        });

        const json = await res.json();
        if (!isMounted) return;

        if (!res.ok || json.error) {
          setError(json.error || `curl: (6) Could not connect to host`);
        } else {
          setData(json);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Network error";
          setError(`curl: (7) Failed to connect to host: ${msg}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    runCurl();

    return () => {
      isMounted = false;
    };
  }, [rawUrl]);

  return (
    <div className="space-y-2 text-xs font-mono select-text leading-relaxed">
      {/* Handshake Telemetry */}
      <div className="text-white/40 text-[11px] space-y-0.5">
        <div>* Trying to connect to {rawUrl}...</div>
        <div>* Connected to {rawUrl} (TLS v1.3 handshake established)</div>
        <div>&gt; GET {rawUrl} HTTP/2</div>
        <div>&gt; User-Agent: curl/8.4.0 (prateek-dev-terminal)</div>
        <div>&gt; Accept: */*</div>
      </div>

      {loading && (
        <div className="text-amber-300 flex items-center gap-2 py-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Awaiting server response...</span>
        </div>
      )}

      {error && (
        <div className="text-rose-400 p-2 rounded bg-rose-500/10 border border-rose-500/20 font-semibold">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-2">
          {/* Response Headers */}
          <div className="text-sky-300 text-[11px] bg-black/30 p-2 rounded border border-white/10 space-y-0.5">
            <div className="font-bold text-white flex items-center justify-between">
              <span
                className={
                  data.status < 400 ? "text-emerald-400" : "text-amber-400"
                }
              >
                &lt; {data.httpVersion} {data.status} {data.statusText}
              </span>
              <span className="text-white/40 font-normal">
                {data.durationMs}ms
              </span>
            </div>
            <div>&lt; content-type: {data.contentType}</div>
            <div>&lt; content-length: {data.byteLength} bytes</div>
            {data.headers["server"] && (
              <div>&lt; server: {data.headers["server"]}</div>
            )}
            {data.headers["date"] && (
              <div>&lt; date: {data.headers["date"]}</div>
            )}
          </div>

          {/* Response Payload */}
          <div className="bg-[#050811] p-3 rounded-lg border border-white/10 overflow-x-auto max-h-[340px] overflow-y-auto">
            <div className="text-[10px] text-white/30 uppercase tracking-widest pb-1 select-none flex items-center justify-between">
              <span>RESPONSE BODY ({data.isJson ? "JSON" : "TEXT"})</span>
              <span className="text-emerald-400">{data.byteLength} bytes</span>
            </div>
            <pre className="text-emerald-300 text-xs font-mono leading-relaxed whitespace-pre">
              {data.body}
            </pre>
          </div>

          {/* Footer status */}
          <div className="text-white/40 text-[11px] flex items-center justify-between pt-0.5">
            <span>* Connection closed cleanly</span>
            <span className="text-emerald-400">
              Transfer completed in {data.durationMs} ms
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. ACTIVE REAL ANIMATED MATRIX RAIN COMPONENT
// ============================================================================
export function ActiveMatrix({ onExit }: { onExit?: () => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [fps, setFps] = React.useState(60);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const updateSize = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = 360; // Immersive height inside terminal window
    };
    updateSize();

    // Matrix glyph set (Katakana, Roman, Numbers, Operators)
    const characters =
      "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}/*=+~-!@#$%^&";
    const charArray = characters.split("");

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * -50),
    );

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const render = (time: number) => {
      // FPS measurement
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      // Fade out previous frame with high-quality opacity trail
      ctx.fillStyle = "rgba(6, 9, 16, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head glyph (bright white-emerald glow)
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#22c55e";
        ctx.fillText(text, x, y);

        // Body glyph (matrix neon green)
        ctx.fillStyle = "#22c55e";
        ctx.shadowBlur = 0;
        if (drops[i] > 1) {
          const trailText =
            charArray[Math.floor(Math.random() * charArray.length)];
          ctx.fillText(trailText, x, (drops[i] - 1) * fontSize);
        }

        // Reset drop when off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Resize listener
    const handleResize = () => {
      updateSize();
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * -50),
      );
    };
    window.addEventListener("resize", handleResize);

    // Escape listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onExit]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden border border-emerald-500/30 bg-[#060910] shadow-2xl select-none my-2"
    >
      {/* Top HUD Controls Overlay */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-black/60 backdrop-blur-md border-b border-emerald-500/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-bold tracking-wider">
            MATRIX RAIN CANVAS // ACTIVE ({fps} FPS)
          </span>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 font-mono text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          title="Exit Matrix (Esc)"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Exit Matrix (Esc)</span>
        </button>
      </div>

      {/* Falling Canvas Rain */}
      <canvas
        ref={canvasRef}
        className="w-full block cursor-pointer"
        onClick={onExit}
        title="Click anywhere or press Esc to return to terminal"
      />

      {/* Bottom Hint */}
      <div className="absolute bottom-1 inset-x-0 z-20 text-center text-[10px] font-mono text-emerald-400/50 pointer-events-none">
        Press [Esc] or click anywhere on the canvas to exit Matrix rain
      </div>
    </div>
  );
}
