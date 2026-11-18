import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blogs";
import { BlogListClient } from "@/components/sections/BlogListClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

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
        url: "/api/og?title=Technical Articles & Engineering Deep Dives&type=blog&desc=Distributed systems, database schema migrations, observability architectures, and algorithmic problem solving.",
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
    images: [
      "/api/og?title=Technical Articles & Engineering Deep Dives&type=blog&desc=Distributed systems, database schema migrations, observability architectures, and algorithmic problem solving.",
    ],
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogListClient initialPosts={posts} />;
}
