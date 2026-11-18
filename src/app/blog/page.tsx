import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blogs";
import { BlogListClient } from "@/components/sections/BlogListClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

const ogUrl = `/api/og?title=${encodeURIComponent("Technical Articles & Engineering Deep Dives")}&type=blog&desc=${encodeURIComponent("Distributed systems, database schema migrations, observability architectures, and algorithmic problem solving.")}`;

export const metadata: Metadata = {
  title: "Blog Posts",
  description:
    "Technical articles and deep dives into distributed systems, database schema migrations, observability architectures, and algorithmic problem solving by Prateek Singh.",
  openGraph: {
    title: "Blog Posts | Prateek Singh",
    description:
      "Technical engineering journal: distributed systems, database migrations, observability, and algorithmic problem solving.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [
      {
        url: ogUrl,
        width: 1200,
        height: 630,
        alt: "Prateek Singh Technical Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Posts | Prateek Singh",
    description:
      "Technical articles on distributed systems, database migrations, and algorithmic problem solving.",
    images: [ogUrl],
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogListClient initialPosts={posts} />;
}
