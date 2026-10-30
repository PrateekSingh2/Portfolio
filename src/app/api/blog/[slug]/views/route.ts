import { NextRequest, NextResponse } from "next/server";

const RTDB_BASE =
  process.env.FIREBASE_RTDB_URL?.replace(/\/+$/, "") ||
  "https://algolib-e0567-default-rtdb.asia-southeast1.firebasedatabase.app";
const BASE_URL = `${RTDB_BASE}/Portfolio/Articles`;

export const dynamic = "force-dynamic";

function sanitizeSlug(slug: string): string {
  return slug.replace(/[.#$\[\]]/g, "_");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug", views: 0 },
        { status: 400 },
      );
    }

    const safeSlug = sanitizeSlug(slug);
    const res = await fetch(`${BASE_URL}/${safeSlug}/views.json`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ slug, views: 0 });
    }

    const data = await res.json();
    const views = typeof data === "number" ? data : 0;

    return NextResponse.json({ slug, views });
  } catch (error) {
    console.error("Error fetching article views:", error);
    return NextResponse.json({ views: 0 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug", views: 0 },
        { status: 400 },
      );
    }

    const safeSlug = sanitizeSlug(slug);
    const url = `${BASE_URL}/${safeSlug}/views.json`;

    // 1. Fetch current views for this specific article
    const getRes = await fetch(url, {
      cache: "no-store",
    });

    let currentViews = 0;
    if (getRes.ok) {
      const data = await getRes.json();
      if (typeof data === "number") {
        currentViews = data;
      }
    }

    const nextViews = currentViews + 1;

    // 2. Write incremented count for this article
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextViews),
    });

    if (!putRes.ok) {
      console.warn(
        "RTDB write article views returned non-ok status:",
        putRes.status,
      );
      return NextResponse.json({ slug, views: currentViews });
    }

    const updated = await putRes.json();
    return NextResponse.json({
      slug,
      views: typeof updated === "number" ? updated : nextViews,
    });
  } catch (error) {
    console.error("Error updating article views:", error);
    return NextResponse.json({ views: 0 });
  }
}
