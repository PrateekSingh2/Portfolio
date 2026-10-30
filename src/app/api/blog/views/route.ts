import { NextResponse } from "next/server";

const RTDB_BASE =
  process.env.FIREBASE_RTDB_URL?.replace(/\/+$/, "") ||
  "https://algolib-e0567-default-rtdb.asia-southeast1.firebasedatabase.app";
const BASE_URL = `${RTDB_BASE}/Portfolio/Articles.json`;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(BASE_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ views: {} });
    }

    const data = await res.json();
    const result: Record<string, number> = {};

    if (data && typeof data === "object") {
      for (const [slug, item] of Object.entries(data)) {
        if (
          item &&
          typeof item === "object" &&
          "views" in item &&
          typeof (item as { views: unknown }).views === "number"
        ) {
          result[slug] = (item as { views: number }).views;
        } else if (typeof item === "number") {
          result[slug] = item;
        }
      }
    }

    return NextResponse.json({ views: result });
  } catch (error) {
    console.error("Error fetching all article views:", error);
    return NextResponse.json({ views: {} });
  }
}
