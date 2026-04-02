export const GITHUB_CONTRIBUTION_ROWS = 7;
export const GITHUB_CONTRIBUTION_COLS = 52;
export const GITHUB_CONTRIBUTION_GRID_SIZE =
  GITHUB_CONTRIBUTION_ROWS * GITHUB_CONTRIBUTION_COLS;
export const DEFAULT_GITHUB_USERNAME = "mugnihidayah";

export interface GitHubContributionDay {
  date: string;
  intensity: number;
}

export interface GitHubActivityResponse {
  total: number;
  contributions: GitHubContributionDay[];
  fetchedAt: string;
  username: string;
}

const TOTAL_CONTRIBUTIONS_REGEX = /(\d{1,3}(?:,\d{3})*)\s+contributions/i;
const CELL_REGEXES = [
  /<td[^>]+data-date="([^"]+)"[^>]+data-level="([^"]+)"/g,
  /<td[^>]+data-level="([^"]+)"[^>]+data-date="([^"]+)"/g,
] as const;

export function extractGithubUsername(
  value: string | null | undefined,
  fallback = DEFAULT_GITHUB_USERNAME
): string {
  const normalized = value?.trim();
  if (!normalized) return fallback;

  const sanitized = normalized.replace(/[?#].*$/, "").replace(/\/+$/, "");
  if (!sanitized.includes("/")) return sanitized || fallback;

  try {
    const url = new URL(sanitized);
    return url.pathname.split("/").filter(Boolean)[0] || fallback;
  } catch {
    const segments = sanitized.split("/").filter(Boolean);
    return segments[segments.length - 1] || fallback;
  }
}

export function parseGitHubContributionsHtml(html: string): {
  total: number;
  contributions: GitHubContributionDay[];
} {
  const totalMatch = html.match(TOTAL_CONTRIBUTIONS_REGEX);
  const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 0;
  const contributions: GitHubContributionDay[] = [];

  for (const regex of CELL_REGEXES) {
    regex.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const [date, intensityValue] =
        regex === CELL_REGEXES[0] ? [match[1], match[2]] : [match[2], match[1]];

      contributions.push({
        date,
        intensity: clampContributionIntensity(parseInt(intensityValue, 10)),
      });
    }

    if (contributions.length > 0) break;
  }

  if (contributions.length === 0) {
    throw new Error("GitHub contribution calendar markup was not found.");
  }

  contributions.sort((a, b) => a.date.localeCompare(b.date));

  return { total, contributions };
}

export function buildGitHubContributionGrid(
  contributions: GitHubContributionDay[],
  rows = GITHUB_CONTRIBUTION_ROWS,
  cols = GITHUB_CONTRIBUTION_COLS
): number[][] {
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  const recentContributions = contributions.slice(-(rows * cols));

  if (recentContributions.length === 0) {
    return grid;
  }

  let row = new Date(`${recentContributions[0].date}T00:00:00.000Z`).getUTCDay();
  let col = 0;

  for (const contribution of recentContributions) {
    grid[row][col] = clampContributionIntensity(contribution.intensity);

    row += 1;
    if (row >= rows) {
      row = 0;
      col += 1;
    }

    if (col >= cols) {
      break;
    }
  }

  return grid;
}

function clampContributionIntensity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(4, value));
}
