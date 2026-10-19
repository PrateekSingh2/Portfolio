import { NextResponse } from "next/server";

const RTDB_URL =
  "https://algolib-e0567-default-rtdb.asia-southeast1.firebasedatabase.app/Portfolio/Visits.json";

export async function GET() {
  try {
    const res = await fetch(RTDB_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ visits: 0 });
    }

    const data = await res.json();
    const visits = typeof data === "number" ? data : 0;

    return NextResponse.json({ visits });
  } catch (error) {
    console.error("Error fetching RTDB visits:", error);
    return NextResponse.json({ visits: 0 });
  }
}

export async function POST() {
  try {
    // 1. Fetch current count
    const getRes = await fetch(RTDB_URL, {
      cache: "no-store",
    });

    let currentVisits = 0;
    if (getRes.ok) {
      const data = await getRes.json();
      if (typeof data === "number") {
        currentVisits = data;
      }
    }

    const nextVisits = currentVisits + 1;

    // 2. Update count in RTDB
    const putRes = await fetch(RTDB_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextVisits),
    });

    if (!putRes.ok) {
      console.warn("RTDB write returned non-ok status:", putRes.status);
      return NextResponse.json({ visits: currentVisits });
    }

    const updated = await putRes.json();
    return NextResponse.json({
      visits: typeof updated === "number" ? updated : nextVisits,
    });
  } catch (error) {
    console.error("Error updating RTDB visits:", error);
    return NextResponse.json({ visits: 0 });
  }
}
