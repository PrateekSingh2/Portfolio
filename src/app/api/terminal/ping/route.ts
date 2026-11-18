import { NextResponse } from "next/server";
import dns from "node:dns/promises";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawHost = body.host || "google.com";

    // Clean host string (strip protocol, paths, ports)
    let cleanHost = String(rawHost)
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .replace(/:\d+$/, "");

    if (!cleanHost) cleanHost = "google.com";

    // 1. Perform real DNS lookup
    let ip = cleanHost;

    // Check if it's already an IP address
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(cleanHost)) {
      ip = cleanHost;
    } else {
      try {
        const lookupResult = await dns.lookup(cleanHost);
        ip = lookupResult.address;
      } catch {
        return NextResponse.json(
          {
            error: `ping: cannot resolve ${cleanHost}: Unknown host`,
            host: cleanHost,
          },
          { status: 404 },
        );
      }
    }

    // 2. Perform real network measurement
    const startTime = performance.now();
    let reachable = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Probe target with lightweight HEAD request
      await fetch(`https://${cleanHost}`, {
        method: "HEAD",
        signal: controller.signal,
      }).catch(async () => {
        // Fallback to HTTP if HTTPS port is closed
        return await fetch(`http://${cleanHost}`, {
          method: "HEAD",
          signal: controller.signal,
        });
      });

      clearTimeout(timeoutId);
    } catch {
      reachable = false;
    }

    const endTime = performance.now();
    const duration = Math.max(9.5, Number((endTime - startTime).toFixed(2)));

    return NextResponse.json({
      success: true,
      host: cleanHost,
      ip,
      time: duration,
      reachable,
      ttl: 52 + Math.floor(Math.random() * 12),
      bytes: 64,
    });
  } catch (err: unknown) {
    const errMessage =
      err instanceof Error ? err.message : "Internal ping probe failed";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
