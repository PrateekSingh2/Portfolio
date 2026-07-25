import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

let cpDataCache: any = null;

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    const fetchOptions: RequestInit = { signal: controller.signal };

    // ─── 1. LeetCode via GraphQL ─────────────────────────────────────────
    const leetcodePromise = fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
      body: JSON.stringify({
        query: `
          query combined($username: String!) {
            matchedUser(username: $username) {
              submitStatsGlobal { acSubmissionNum { difficulty count } }
              userCalendar {
                totalActiveDays
                streak
              }
            }
            userContestRanking(username: $username) { rating attendedContestsCount }
            userContestRankingHistory(username: $username) {
              attended rating
              contest { title startTime }
            }
          }
        `,
        variables: { username: "prateek_singh7" }
      }),
      ...fetchOptions
    }).then(res => res.json()).then(data => {
      const match = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
      const userCalendar = data?.data?.matchedUser?.userCalendar || {};
      const contest = data?.data?.userContestRanking || {};
      const historyRaw = data?.data?.userContestRankingHistory || [];
      
      const history = historyRaw
        .filter((h: any) => h.attended)
        .map((h: any) => ({
          title: h.contest.title,
          startTime: h.contest.startTime,
          rating: Math.round(h.rating)
        }));

      return {
        platform: "LeetCode",
        rating: Math.round(contest.rating || 0),
        maxRating: Math.round(contest.rating || 0),
        contests: contest.attendedContestsCount || 0,
        activeDays: userCalendar.totalActiveDays || 0,
        streak: userCalendar.streak || 0,
        rank: (contest.rating || 0) >= 1600 ? "Knight" : "Coder",
        solved: match.find((s: any) => s.difficulty === "All")?.count || 0,
        history,
        easy: match.find((s: any) => s.difficulty === "Easy")?.count || 0,
        medium: match.find((s: any) => s.difficulty === "Medium")?.count || 0,
        hard: match.find((s: any) => s.difficulty === "Hard")?.count || 0,
      };
    }).catch(() => {
      return null; 
    });

    // ─── 2. Codeforces via Official API ───────────────────────────────────
    const codeforcesPromise = Promise.all([
      fetch("https://codeforces.com/api/user.info?handles=RajawatPrateekSingh", fetchOptions).then(r => r.json()),
      fetch("https://codeforces.com/api/user.rating?handle=RajawatPrateekSingh", fetchOptions).then(r => r.json()),
      fetch("https://codeforces.com/api/user.status?handle=RajawatPrateekSingh", fetchOptions).then(r => r.json())
    ]).then(([infoData, ratingData, statusData]) => {
      const user = infoData.result?.[0] || {};
      const history = ratingData.result || [];
      const submissions = statusData.result || [];
      
      const solvedProblems = new Set();
      submissions.forEach((sub: any) => {
        if (sub.verdict === "OK" && sub.problem) {
          solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
        }
      });
      
      return {
        platform: "Codeforces",
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        rank: user.rank || "Newbie",
        maxRank: user.maxRank || "Newbie",
        solved: solvedProblems.size,
        contests: history.length,
        history: history.map((h: any) => ({
          title: h.contestName,
          startTime: h.ratingUpdateTimeSeconds,
          rating: h.newRating
        }))
      };
    }).catch(() => {
      return null;
    });

    // ─── 3. CodeChef via Native Web Scraping (cheerio) ─────────────────────
    const codechefPromise = fetch("https://www.codechef.com/users/nice_trail_87", {
      ...fetchOptions,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      }
    })
      .then(r => r.text())
      .then(html => {
        const $ = cheerio.load(html);
        const currentRating = parseInt($(".rating-header .rating-number").first().text()) || 0;
        const maxRatingText = $(".rating-header small").first().text();
        const maxRatingMatch = maxRatingText.match(/Highest Rating (\d+)/);
        const maxRating = maxRatingMatch ? parseInt(maxRatingMatch[1]) : currentRating;
        const stars = $(".rating-star").first().text().trim() || "1★";

        // Parse DSA rating from rating-header containing "DSA Rating"
        let dsaRating = 0;
        let dsaMaxRating = 0;
        $(".rating-header").each((_, el) => {
          const text = $(el).text();
          if (text.includes("DSA Rating")) {
            const numText = $(el).find(".rating-number").text().replace(/[^\d]/g, "");
            if (numText) dsaRating = parseInt(numText) || 0;
            const dsaSmall = $(el).find("small").text();
            const dsaMaxMatch = dsaSmall.match(/Highest Rating (\d+)/);
            if (dsaMaxMatch) dsaMaxRating = parseInt(dsaMaxMatch[1]) || dsaRating;
          }
        });

        // Parse Rating History from script tag settings embedded in HTML
        let history: any[] = [];
        let dsaHistory: any[] = [];
        const ratingMatch = html.match(/"date_versus_rating"\s*:\s*({[\s\S]+?}),\s*"user_initial_ratings"/);
        if (ratingMatch) {
          try {
            const ratingObj = JSON.parse(ratingMatch[1]);
            if (ratingObj.all && Array.isArray(ratingObj.all)) {
              history = ratingObj.all.map((item: any) => ({
                title: item.name,
                rating: parseInt(item.rating) || 0,
                startTime: item.end_date,
                code: item.code,
                rank: item.rank
              }));
            }
            if (ratingObj.dsa_monday && Array.isArray(ratingObj.dsa_monday)) {
              dsaHistory = ratingObj.dsa_monday.map((item: any) => ({
                title: item.name,
                rating: parseInt(item.rating) || 0,
                startTime: item.end_date,
                code: item.code,
                rank: item.rank
              }));
            }
          } catch {
            // Safe JSON parse fallback
          }
        }

        if (!dsaRating && dsaHistory.length > 0) {
          dsaRating = dsaHistory[dsaHistory.length - 1].rating;
          dsaMaxRating = Math.max(...dsaHistory.map((h: any) => h.rating));
        }

        const startersContests = history.length;
        const dsaContests = dsaHistory.length;
        const totalContests = startersContests + dsaContests;

        const globalRank = parseInt($(".rating-ranks a[href*='ratings'] strong").first().text().trim()) || 0;
        const countryRank = parseInt($(".rating-ranks a[href*='ratings'] strong").last().text().trim()) || 0;

        return {
          platform: "CodeChef",
          rating: currentRating,
          maxRating: maxRating,
          rank: stars,
          dsaRating: dsaRating,
          dsaMaxRating: dsaMaxRating,
          contests: totalContests,
          startersContests: startersContests,
          dsaContests: dsaContests,
          solved: 0,
          globalRank: globalRank,
          countryRank: countryRank,
          history: history,
          dsaHistory: dsaHistory
        };
      }).catch(() => {
        return null;
      });

    // ─── 4. GeeksForGeeks via Native Web Scraping (cheerio & RegExp) ───────
    const gfgPromise = fetch("https://www.geeksforgeeks.org/profile/rajawatprateeksingh/", fetchOptions)
      .then(r => r.text())
      .then(html => {
        let codingScore = 0;
        let problemsSolved = 0;
        let streak = 0;

        // Parse using robust RegExp supporting Next.js flight stream escaped quotes
        const scoreMatch = html.match(/\\?"score\\?"\s*:\s*(\d+)/);
        const solvedMatch = html.match(/\\?"total_problems_solved\\?"\s*:\s*(\d+)/);
        const streakMatch = html.match(/\\?"pod_solved_longest_streak\\?"\s*:\s*(\d+)/) || html.match(/\\?"pod_solved_current_streak\\?"\s*:\s*(\d+)/);

        if (scoreMatch) codingScore = parseInt(scoreMatch[1]) || 0;
        if (solvedMatch) problemsSolved = parseInt(solvedMatch[1]) || 0;
        if (streakMatch) streak = parseInt(streakMatch[1]) || 0;

        return {
          platform: "GeeksForGeeks",
          codingScore: codingScore,
          rating: codingScore,
          maxRating: codingScore,
          problemsSolved: problemsSolved,
          solved: problemsSolved,
          streak: streak,
          rank: "Coder",
          history: []
        };
      }).catch(() => {
        return null;
      });

    // Resolve all promises concurrently
    const [leetcode, codeforces, codechef, gfg] = await Promise.all([
      leetcodePromise, 
      codeforcesPromise, 
      codechefPromise, 
      gfgPromise
    ]);
    
    clearTimeout(timeoutId);

    // Merge with previous cache if an individual platform fetch failed
    const effectiveLeetcode = leetcode || cpDataCache?.leetcode || { easy: 0, medium: 0, hard: 0, rating: 0, maxRating: 0 };
    const effectiveCodeforces = codeforces || cpDataCache?.codeforces || { rating: 0, maxRating: 0 };
    const effectiveCodechef = codechef || cpDataCache?.codechef || { rating: 0, maxRating: 0, dsaRating: 0, dsaMaxRating: 0, contests: 0, startersContests: 0, dsaContests: 0 };
    const effectiveGfg = gfg || cpDataCache?.gfg || { rating: 0, solved: 0, codingScore: 0, problemsSolved: 0, streak: 0 };

    const mockData = [
      effectiveLeetcode,
      effectiveCodeforces,
      effectiveCodechef,
      effectiveGfg,
    ];

    const responsePayload = {
      leetcode: effectiveLeetcode,
      codeforces: effectiveCodeforces,
      codechef: effectiveCodechef,
      gfg: effectiveGfg,
      lcHistory: leetcode?.history || cpDataCache?.lcHistory || [],
      cfHistory: codeforces?.history || cpDataCache?.cfHistory || [],
      ccHistory: codechef?.history || cpDataCache?.ccHistory || [],
      ccDsaHistory: codechef?.dsaHistory || cpDataCache?.ccDsaHistory || [],
      profiles: mockData
    };

    // Store in memory cache if at least one platform returned valid data
    if (leetcode || codeforces || codechef || gfg) {
      cpDataCache = responsePayload;
    }

    return NextResponse.json(responsePayload);

  } catch {
    if (cpDataCache) {
      return NextResponse.json(cpDataCache);
    }
    return NextResponse.json({ error: "Failed to fetch CP data" }, { status: 500 });
  }
}
