import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = getAllBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
