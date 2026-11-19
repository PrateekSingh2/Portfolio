import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateekdev.me";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og", "/llms.txt"],
        disallow: ["/api/terminal/", "/api/cp/", "/api/github/"],
      },
      // Explicitly allow modern AI agent crawlers for AgentEO
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Applebot",
          "Google-Extended",
          "cohere-ai",
          "anthropic-ai",
        ],
        allow: ["/", "/blog/", "/projects/", "/cli/", "/api/og", "/llms.txt"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
