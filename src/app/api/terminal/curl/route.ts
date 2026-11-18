import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const {
      url,
      method = "GET",
      headers = {},
    } = await req.json().catch(() => ({}));

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "curl: no URL specified" },
        { status: 400 },
      );
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response: Response;
    try {
      response = await fetch(targetUrl, {
        method,
        headers: {
          "User-Agent": "curl/8.4.0 (prateek-dev-terminal-agent)",
          Accept: "*/*",
          ...headers,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      const errObj = fetchErr as
        { name?: string; message?: string } | undefined;
      const isTimeout = errObj?.name === "AbortError";
      return NextResponse.json(
        {
          error: isTimeout
            ? `curl: (28) Operation timed out after 8000 milliseconds for ${targetUrl}`
            : `curl: (6) Could not resolve or connect to host: ${errObj?.message || "Connection refused"}`,
          url: targetUrl,
        },
        { status: 502 },
      );
    }

    const endTime = performance.now();
    const durationMs = Number((endTime - startTime).toFixed(1));

    // Capture headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    const contentType = response.headers.get("content-type") || "text/plain";
    let bodyText = "";

    try {
      const rawText = await response.text();
      // Bound text at 10KB to keep terminal snappy
      if (rawText.length > 10240) {
        bodyText =
          rawText.slice(0, 10240) +
          "\n\n# ... [terminal output truncated: response exceeded 10KB limit] ...";
      } else {
        bodyText = rawText;
      }
    } catch {
      bodyText = "[binary stream payload or non-text response]";
    }

    // Try parsing as JSON to check if it's structured data
    let isJson = false;
    try {
      if (contentType.includes("json")) {
        JSON.parse(bodyText);
        isJson = true;
      }
    } catch {
      isJson = false;
    }

    return NextResponse.json({
      success: true,
      url: targetUrl,
      status: response.status,
      statusText: response.statusText || (response.status === 200 ? "OK" : ""),
      httpVersion: "HTTP/2",
      headers: responseHeaders,
      contentType,
      body: bodyText,
      isJson,
      durationMs,
      byteLength: new Blob([bodyText]).size,
    });
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `curl: internal error: ${errMessage}` },
      { status: 500 },
    );
  }
}
