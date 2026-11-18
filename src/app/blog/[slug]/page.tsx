import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blogs";
import { BlogArticleClient } from "@/components/sections/BlogArticleClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

// Pre-render all blog slugs statically for instant load & SEO indexation
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate dynamic SEO metadata for each article
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested technical article could not be found.",
    };
  }

  const postUrl = `${siteUrl}/blog/${slug}`;
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(
    post.title,
  )}&desc=${encodeURIComponent(post.excerpt)}&tags=${encodeURIComponent(
    post.tags.join(","),
  )}&readTime=${encodeURIComponent(post.readingTime || "")}&type=blog`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [
      ...post.tags,
      "Software Engineering",
      "System Architecture",
      "Algorithms",
      "Prateek Singh",
    ],
    authors: [{ name: post.author, url: siteUrl }],
    creator: post.author,
    publisher: "Prateek Singh",
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      siteName: "Prateek Singh | Engineering Journal",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
      creator: "@RajawatPrateek",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Schema.org BlogPosting structured data for Google Rich Results
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}/images/profile.png`,
    author: {
      "@type": "Person",
      name: post.author,
      url: siteUrl,
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <BlogArticleClient post={post} />
    </>
  );
}
