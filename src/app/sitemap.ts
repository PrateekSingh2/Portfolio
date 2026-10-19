import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

  const posts = getAllBlogPosts();

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
    let dateStr = new Date().toISOString();
    try {
      const parsed = new Date(post.publishedAt);
      if (!isNaN(parsed.getTime())) {
        dateStr = parsed.toISOString();
      }
    } catch {
      // keep fallback
    }

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: dateStr,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...blogEntries,
  ];
}
