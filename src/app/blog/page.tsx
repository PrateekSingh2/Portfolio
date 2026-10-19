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
        url: "/images/profile.png",
        width: 800,
        height: 800,
        alt: "Prateek Singh Technical Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Posts | Prateek Singh",
    description:
      "Technical articles on distributed systems, database migrations, and algorithmic problem solving.",
    images: ["/images/profile.png"],
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogListClient initialPosts={posts} />;
}
