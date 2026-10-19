import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOGS_DIR = path.join(process.cwd(), "data", "blogs");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  publishedAt: string;
  readingTime?: string;
  tags: string[];
  content: string;
  wordCount?: number;
}

// Ensure data/blogs directory exists
function ensureBlogsDirectory() {
  if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
  }
}

// Estimate reading time based on word count (~200 wpm)
function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

// Get all blog posts from data/blogs/*.md
export function getAllBlogPosts(): BlogPost[] {
  ensureBlogsDirectory();

  try {
    const fileNames = fs.readdirSync(BLOGS_DIR);
    const mdFiles = fileNames.filter((file) => file.endsWith(".md"));

    const posts = mdFiles.map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(BLOGS_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

      return {
        slug: data.slug || slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        author: data.author || "Prateek Singh",
        authorAvatar: data.authorAvatar || "/images/profile.png",
        publishedAt: data.publishedAt || "Recent",
        readingTime: data.readingTime || calculateReadingTime(content),
        tags: Array.isArray(data.tags) ? data.tags : [],
        content,
        wordCount,
      } as BlogPost;
    });

    // Sort by date descending
    return posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
}

// Get a single post by its slug
export function getBlogPostBySlug(slug: string): BlogPost | null {
  ensureBlogsDirectory();

  try {
    const filePath = path.join(BLOGS_DIR, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      // Try finding by slug property inside frontmatter if filename differs
      const allPosts = getAllBlogPosts();
      return allPosts.find((p) => p.slug === slug) || null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return {
      slug: data.slug || slug,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      author: data.author || "Prateek Singh",
      authorAvatar: data.authorAvatar || "/images/profile.png",
      publishedAt: data.publishedAt || "Recent",
      readingTime: data.readingTime || calculateReadingTime(content),
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
      wordCount,
    } as BlogPost;
  } catch (error) {
    console.error(`Error loading blog post for slug "${slug}":`, error);
    return null;
  }
}

// Get all slugs for static site generation and sitemap
export function getAllBlogSlugs(): string[] {
  ensureBlogsDirectory();
  try {
    const fileNames = fs.readdirSync(BLOGS_DIR);
    return fileNames
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}
