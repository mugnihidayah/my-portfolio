import { NextResponse } from "next/server";
import {
  extractGithubUsername,
  parseGitHubContributionsHtml,
} from "@/lib/githubActivity";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
};

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { username: rawUsername } = await params;
    const username = extractGithubUsername(rawUsername);

    if (!username) {
      return NextResponse.json(
        { error: "GitHub username is required." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(username)}/contributions?v=${Date.now()}`,
      {
        cache: "no-store",
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub activity." },
        { status: response.status, headers: NO_STORE_HEADERS }
      );
    }

    const html = await response.text();
    const { total, contributions } = parseGitHubContributionsHtml(html);

    return NextResponse.json(
      {
        total,
        contributions,
        fetchedAt: new Date().toISOString(),
        username,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("GitHub fetch error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
