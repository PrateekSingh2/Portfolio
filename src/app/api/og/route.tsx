import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic Query Parameters with sensible defaults
    const title =
      searchParams.get("title") ||
      "Prateek Singh | Software Systems Engineer & AI Builder";
    const type = searchParams.get("type") || "default"; // "blog" | "project" | "default"
    const desc =
      searchParams.get("desc") ||
      "High-performance backend systems, distributed architectures, stateful LLM pipelines & competitive programming.";
    const tagsParam = searchParams.get("tags") || "";
    const readTime = searchParams.get("readTime") || "";

    const tags = tagsParam
      ? tagsParam
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 4)
      : [
          "AI Systems",
          "LangGraph",
          "Distributed Systems",
          "Competitive Programming",
        ];

    const badgeLabel =
      type === "blog"
        ? "TECHNICAL ARTICLE"
        : type === "project"
          ? "SYSTEM ARCHITECTURE"
          : "ENGINEERING PORTFOLIO";

    const badgeColor =
      type === "blog"
        ? "#38bdf8" // Sky
        : type === "project"
          ? "#10b981" // Emerald
          : "#a855f7"; // Purple

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#070b13",
          backgroundImage:
            "linear-gradient(135deg, #070b13 0%, #0c1322 50%, #070b13 100%)",
          padding: "54px 64px",
          position: "relative",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Subtle Top Border Gradient Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "4px",
            display: "flex",
            backgroundImage: `linear-gradient(90deg, ${badgeColor}, #6366f1, #06b6d4)`,
          }}
        />

        {/* Top Bar: Brand, Domain, Type Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Terminal Logo Icon */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              &gt;_
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#f8fafc",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Prateek Singh
              </span>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                prateekdev.me
              </span>
            </div>
          </div>

          {/* Type Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${badgeColor}40`,
              color: badgeColor,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: badgeColor,
                display: "flex",
              }}
            />
            <span style={{ display: "flex" }}>{badgeLabel}</span>
          </div>
        </div>

        {/* Center Main Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Title with punchy, high-contrast typography */}
          <h1
            style={{
              fontSize: title.length > 60 ? "46px" : "56px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: 0,
              display: "flex",
            }}
          >
            {title}
          </h1>

          {/* Secondary Excerpt */}
          {desc && (
            <p
              style={{
                fontSize: "20px",
                color: "#94a3b8",
                lineHeight: 1.45,
                margin: 0,
                maxHeight: "60px",
                overflow: "hidden",
                display: "flex",
              }}
            >
              {desc}
            </p>
          )}

          {/* Tech Tags Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {tags.map((tag, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#cbd5e1",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Author info & Reading Time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {/* Author Avatar Pill */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "22px",
                backgroundColor: "rgba(56, 189, 248, 0.2)",
                border: "2px solid rgba(56, 189, 248, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              PS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#f1f5f9",
                  fontSize: "15px",
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                Prateek Singh
              </span>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  display: "flex",
                }}
              >
                AI Engineer &amp; Systems Architect • CodeChef 3-Star
              </span>
            </div>
          </div>

          {readTime ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#94a3b8",
                fontSize: "13px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <span style={{ display: "flex" }}>{readTime} read</span>
            </div>
          ) : null}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
    );
  } catch (error) {
    console.error("OG Image generation failure:", error);
    return new Response("Failed to generate OpenGraph image", { status: 500 });
  }
}
