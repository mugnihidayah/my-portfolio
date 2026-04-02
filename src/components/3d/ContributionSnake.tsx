"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { profile } from "@/data/profile";
import { useMobile } from "@/hooks/useMobile";
import {
  buildGitHubContributionGrid,
  extractGithubUsername,
  GITHUB_CONTRIBUTION_COLS as COLS,
  GITHUB_CONTRIBUTION_ROWS as ROWS,
  type GitHubActivityResponse,
} from "@/lib/githubActivity";

// ─── Configuration ────────────────────────────────────────────
// default baseline cell size, overwritten by responsive layout
const BASE_CELL_SIZE = 12;
const CELL_GAP = 2;
const CELL_RADIUS = 2;
const TICK_MS = 60; // snake speed
const LIVE_REFRESH_MS = 5 * 60 * 1000;
const MIN_CELL_SIZE = 4;
const MOBILE_MIN_CELL_SIZE = 6.5;
const EATEN_RECOVERY_MS = 2000;
const EATEN_FADE_STEP = TICK_MS / EATEN_RECOVERY_MS;

const CONSTANT_SNAKE_LENGTH = 12;
const DIRECTIONS: Array<readonly [number, number]> = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

// GitHub green palette
const LEVEL_COLORS = [
  "#161b22", // 0: empty
  "#0e4429", // 1: low
  "#006d32", // 2: medium
  "#26a641", // 3: high
  "#39d353", // 4: max
];

const SNAKE_COLOR = "#58a6ff"; // VS Code blue
const SNAKE_GLOW = "#79c0ff";
const EATEN_COLOR = "#0d1117";
const BG_COLOR = "transparent"; // responsive container bg

// ─── Types ────────────────────────────────────────────────────
interface Point {
  r: number;
  c: number;
}

interface Stats {
  total: number;
  activeDays: number;
  maxStreak: number;
}

interface GameState {
  grid: number[][];
  eaten: boolean[][];
  snake: Point[];
  target: Point | null;
  roamTarget: Point | null;
  eatenCount: number;
  totalFood: number;
  animatedCells: Set<string>;
  fadeAlpha: Map<string, number>;
  stats: Stats;
  cellSize: number; // dynamic size
}

// ─── Pathfinding: BFS to nearest food ─────────────────────────
function findNearestFood(
  head: Point,
  grid: number[][],
  eaten: boolean[][],
  snakeSet: Set<string>
): Point | null {
  const visited = new Set<string>();
  const queue: Point[] = [head];
  visited.add(`${head.r},${head.c}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (
      grid[current.r][current.c] > 0 &&
      !eaten[current.r][current.c] &&
      !(current.r === head.r && current.c === head.c)
    ) {
      return current;
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = current.r + dr;
      const nc = current.c + dc;
      const key = `${nr},${nc}`;

      if (
        nr >= 0 &&
        nr < ROWS &&
        nc >= 0 &&
        nc < COLS &&
        !visited.has(key) &&
        !snakeSet.has(key)
      ) {
        visited.add(key);
        queue.push({ r: nr, c: nc });
      }
    }
  }
  return null;
}

function getNextStep(
  head: Point,
  target: Point,
  snakeSet: Set<string>
): Point | null {
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: Point[] = [target];
  const targetKey = `${target.r},${target.c}`;
  const headKey = `${head.r},${head.c}`;
  visited.add(targetKey);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentKey = `${current.r},${current.c}`;

    if (currentKey === headKey) {
      let cur = headKey;
      const path: string[] = [cur];
      while (parent.has(cur)) {
        cur = parent.get(cur)!;
        path.push(cur);
      }
      if (path.length >= 2) {
        const [nr, nc] = path[1].split(",").map(Number);
        return { r: nr, c: nc };
      }
      return null;
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = current.r + dr;
      const nc = current.c + dc;
      const key = `${nr},${nc}`;

      if (
        nr >= 0 &&
        nr < ROWS &&
        nc >= 0 &&
        nc < COLS &&
        !visited.has(key) &&
        (!snakeSet.has(key) || key === headKey)
      ) {
        visited.add(key);
        parent.set(key, currentKey);
        queue.push({ r: nr, c: nc });
      }
    }
  }
  return null;
}

function computeStats(grid: number[][]): Stats {
  let total = 0;
  let activeDays = 0;
  let maxStreak = 0;
  let currentStreak = 0;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const v = grid[r][c];
      total += v;
      if (v > 0) {
        activeDays++;
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }
  }
  return { total, activeDays, maxStreak };
}

function arePointsEqual(a: Point | null, b: Point | null): boolean {
  return !!a && !!b && a.r === b.r && a.c === b.c;
}

function areGridsEqual(a: number[][] | null, b: number[][]): boolean {
  if (!a || a.length !== b.length) return false;

  for (let r = 0; r < b.length; r++) {
    if (!a[r] || a[r].length !== b[r].length) return false;

    for (let c = 0; c < b[r].length; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }

  return true;
}

function createSnakeBlockers(snake: Point[]): Set<string> {
  return new Set(snake.slice(0, -1).map((segment) => `${segment.r},${segment.c}`));
}

function findRoamTarget(
  head: Point,
  snakeSet: Set<string>,
  previousTarget: Point | null
): Point | null {
  const candidates: Array<{ point: Point; score: number }> = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = `${r},${c}`;
      if (snakeSet.has(key)) continue;

      const distance = Math.abs(head.r - r) + Math.abs(head.c - c);
      const edgeBonus = r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1 ? 0.35 : 0;
      const repeatPenalty =
        previousTarget && previousTarget.r === r && previousTarget.c === c ? 5 : 0;

      candidates.push({
        point: { r, c },
        score: distance + edgeBonus + Math.random() * 2 - repeatPenalty,
      });
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => b.score - a.score);
  const topCandidates = candidates.slice(0, Math.min(12, candidates.length));
  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];

  return selected?.point ?? null;
}

function getRoamingStep(head: Point, snake: Point[]): Point | null {
  const blockers = createSnakeBlockers(snake);
  const tail = snake[snake.length - 1];
  const tailKey = `${tail.r},${tail.c}`;
  const options: Array<{ point: Point; score: number }> = [];

  for (const [dr, dc] of DIRECTIONS) {
    const nr = head.r + dr;
    const nc = head.c + dc;
    const key = `${nr},${nc}`;

    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) {
      continue;
    }

    if (blockers.has(key) && key !== tailKey) {
      continue;
    }

    const centerDistance = Math.abs(nr - (ROWS - 1) / 2) + Math.abs(nc - (COLS - 1) / 2);
    options.push({
      point: { r: nr, c: nc },
      score: Math.random() * 3 + centerDistance * 0.2,
    });
  }

  if (options.length === 0) {
    return null;
  }

  options.sort((a, b) => b.score - a.score);
  return options[0].point;
}

function advanceSnake(state: GameState, next: Point) {
  const cellKey = `${next.r},${next.c}`;
  state.snake.unshift(next);

  if (state.grid[next.r][next.c] > 0 && !state.eaten[next.r][next.c]) {
    state.eaten[next.r][next.c] = true;
    if (!state.animatedCells.has(cellKey)) {
      state.fadeAlpha.set(cellKey, 1);
      state.animatedCells.add(cellKey);
    }
    state.eatenCount++;
  }

  state.eaten[next.r][next.c] = true;

  while (state.snake.length > CONSTANT_SNAKE_LENGTH) {
    state.snake.pop();
  }
}

// ─── Main Component ───────────────────────────────────────────
export default function ContributionSnake() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const hasLoadedActivityRef = useRef(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fetchedGridRef = useRef<number[][] | null>(null);
  const isMobile = useMobile(768);

  const buildInitialState = useCallback(
    (grid: number[][], cellSize: number, overrideTotal?: number): GameState => {
      const eaten: boolean[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(false)
      );
      let totalFood = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c] > 0) totalFood++;
        }
      }

      // Initial snake
      const snake: Point[] = [];
      const startR = Math.floor(ROWS / 2);
      for (let i = 0; i < CONSTANT_SNAKE_LENGTH; i++) {
        snake.push({ r: startR, c: Math.max(0, 10 - i) });
      }

      for (const p of snake) {
        eaten[p.r][p.c] = true;
      }
      
      const stats = computeStats(grid);
      if (overrideTotal !== undefined) {
        stats.total = overrideTotal;
      }

      return {
        grid,
        eaten,
        snake,
        target: null,
        roamTarget: null,
        eatenCount: 0,
        totalFood,
        animatedCells: new Set<string>(),
        fadeAlpha: new Map<string, number>(),
        stats,
        cellSize,
      };
    },
    []
  );

  const loadGitHubActivity = useCallback(
    async (silent = false) => {
      const username = extractGithubUsername(profile.github);

      fetchAbortRef.current?.abort();
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      if (!silent && !hasLoadedActivityRef.current) {
        setLoading(true);
      }

      try {
        const response = await fetch(`/api/github/${encodeURIComponent(username)}`, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`GitHub activity request failed with ${response.status}`);
        }

        const payload: GitHubActivityResponse = await response.json();
        const nextGrid = buildGitHubContributionGrid(payload.contributions);
        const currentTotal = stateRef.current?.stats.total;

        if (
          areGridsEqual(fetchedGridRef.current, nextGrid) &&
          currentTotal === payload.total &&
          stateRef.current
        ) {
          hasLoadedActivityRef.current = true;
          setErrorMsg(null);
          setLoading(false);
          return;
        }

        const nextCellSize = stateRef.current?.cellSize ?? BASE_CELL_SIZE;
        const nextState = buildInitialState(nextGrid, nextCellSize, payload.total);

        if (controller.signal.aborted) {
          return;
        }

        fetchedGridRef.current = nextGrid;
        stateRef.current = nextState;
        hasLoadedActivityRef.current = true;

        setStats(nextState.stats);
        setErrorMsg(null);
        setLoading(false);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(error);

        if (!silent || !hasLoadedActivityRef.current) {
          setErrorMsg("Failed to load GitHub activity. Please try again.");
          setLoading(false);
        }
      }
    },
    [buildInitialState]
  );

  useEffect(() => {
    void loadGitHubActivity();

    const handleRefresh = () => {
      void loadGitHubActivity(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleRefresh();
      }
    };

    const refreshTimer = window.setInterval(handleRefresh, LIVE_REFRESH_MS);

    window.addEventListener("focus", handleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      fetchAbortRef.current?.abort();
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadGitHubActivity]);



  const draw = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !stateRef.current) return;

    const s = stateRef.current;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cSize = s.cellSize;

    const gridW = COLS * (cSize + CELL_GAP) - CELL_GAP;
    const gridH = ROWS * (cSize + CELL_GAP) - CELL_GAP;
    const offsetX = (w - gridW) / 2;
    const offsetY = (h - gridH) / 2;

    ctx.clearRect(0, 0, w, h);

    // Draw grid cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = offsetX + c * (cSize + CELL_GAP);
        const y = offsetY + r * (cSize + CELL_GAP);
        const key = `${r},${c}`;

        const fadeVal = s.fadeAlpha.get(key);
        const isTemporarilyHidden =
          s.eaten[r][c] && fadeVal !== undefined && fadeVal > 0 && s.grid[r][c] > 0;

        ctx.fillStyle = isTemporarilyHidden ? EATEN_COLOR : LEVEL_COLORS[s.grid[r][c]];
        ctx.beginPath();
        ctx.roundRect(x, y, cSize, cSize, CELL_RADIUS);
        ctx.fill();

        if (isTemporarilyHidden && fadeVal < 0.35) {
          ctx.globalAlpha = (0.35 - fadeVal) / 0.35;
          ctx.fillStyle = LEVEL_COLORS[s.grid[r][c]];
          ctx.beginPath();
          ctx.roundRect(x, y, cSize, cSize, CELL_RADIUS);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        if (isTemporarilyHidden) {
          ctx.globalAlpha = 0.12 + fadeVal * 0.16;
          ctx.fillStyle = SNAKE_GLOW;
          ctx.beginPath();
          ctx.roundRect(x, y, cSize, cSize, CELL_RADIUS);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }

    // Draw snake with glow
    ctx.shadowColor = SNAKE_GLOW;
    ctx.shadowBlur = 8;

    for (let i = s.snake.length - 1; i >= 0; i--) {
      const p = s.snake[i];
      const x = offsetX + p.c * (cSize + CELL_GAP);
      const y = offsetY + p.r * (cSize + CELL_GAP);

      const alpha = 0.4 + 0.6 * (1 - i / s.snake.length);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = i === 0 ? SNAKE_GLOW : SNAKE_COLOR;

      ctx.beginPath();
      ctx.roundRect(x, y, cSize, cSize, i === 0 ? 3 : CELL_RADIUS);
      ctx.fill();

      // Eyes on head
      if (i === 0) {
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        const eyeSize = Math.max(1.5, cSize * 0.15);
        const dir =
          s.snake.length > 1
            ? { r: p.r - s.snake[1].r, c: p.c - s.snake[1].c }
            : { r: 0, c: 1 };

        let ey1: number, ex1: number, ey2: number, ex2: number;
        // relative placements
        const paddingEye = cSize * 0.25;
        if (dir.c === 1) { // right
          ex1 = x + cSize - paddingEye * 1.5; ey1 = y + paddingEye;
          ex2 = x + cSize - paddingEye * 1.5; ey2 = y + cSize - paddingEye - eyeSize;
        } else if (dir.c === -1) { // left
          ex1 = x + paddingEye; ey1 = y + paddingEye;
          ex2 = x + paddingEye; ey2 = y + cSize - paddingEye - eyeSize;
        } else if (dir.r === 1) { // down
          ex1 = x + paddingEye * 1.5; ey1 = y + cSize - paddingEye * 1.5;
          ex2 = x + cSize - paddingEye * 1.5 - eyeSize; ey2 = y + cSize - paddingEye * 1.5;
        } else { // up
          ex1 = x + paddingEye * 1.5; ey1 = y + paddingEye;
          ex2 = x + cSize - paddingEye * 1.5 - eyeSize; ey2 = y + paddingEye;
        }

        ctx.beginPath();
        ctx.arc(ex1 + eyeSize / 2, ey1 + eyeSize / 2, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex2 + eyeSize / 2, ey2 + eyeSize / 2, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = SNAKE_GLOW;
        ctx.shadowBlur = 8;
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    if (!stateRef.current || loading) return;
    const s = stateRef.current;

    // Fade out eaten grid elements
    const keysToRemove: string[] = [];
    s.fadeAlpha.forEach((val, key) => {
      const newVal = val - EATEN_FADE_STEP;
      if (newVal <= 0) {
        keysToRemove.push(key);
      } else {
        s.fadeAlpha.set(key, newVal);
      }
    });
    keysToRemove.forEach((k) => s.fadeAlpha.delete(k));

    const head = s.snake[0];
    const snakeSet = createSnakeBlockers(s.snake);
    const allFoodEaten = s.eatenCount >= s.totalFood;

    if (allFoodEaten) {
      if (
        !s.roamTarget ||
        arePointsEqual(head, s.roamTarget) ||
        snakeSet.has(`${s.roamTarget.r},${s.roamTarget.c}`)
      ) {
        s.roamTarget = findRoamTarget(head, snakeSet, s.roamTarget);
      }

      let next =
        s.roamTarget ? getNextStep(head, s.roamTarget, snakeSet) : null;

      if (!next) {
        s.roamTarget = findRoamTarget(head, snakeSet, s.roamTarget);
        next = s.roamTarget ? getNextStep(head, s.roamTarget, snakeSet) : null;
      }

      if (!next) {
        next = getRoamingStep(head, s.snake);
      }

      if (next) {
        advanceSnake(s, next);
      }
    } else {
      if (!s.target || s.eaten[s.target.r][s.target.c]) {
        s.target = findNearestFood(head, s.grid, s.eaten, snakeSet);
      }

      if (s.target) {
        const next = getNextStep(head, s.target, snakeSet);
        if (next) {
          advanceSnake(s, next);
        } else {
          s.target = null;
        }
      }
    }

    if (canvasRef.current) {
      draw(canvasRef.current);
    }
  }, [draw, loading]);

  // Handle Resize and Main Loop
  useEffect(() => {
    if (loading || !fetchedGridRef.current) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const updateSize = () => {
      if (!viewportRef.current || !canvasRef.current || !stateRef.current) return;
      
      const rect = viewportRef.current.getBoundingClientRect();
      const availableWidth = Math.max(0, rect.width);
      const minCellSize = isMobile ? MOBILE_MIN_CELL_SIZE : MIN_CELL_SIZE;
      const newCSize = Math.max(
        minCellSize,
        (availableWidth - (COLS - 1) * CELL_GAP) / COLS
      );

      stateRef.current.cellSize = newCSize;

      const gridH = ROWS * (newCSize + CELL_GAP) - CELL_GAP;
      const gridW = COLS * (newCSize + CELL_GAP) - CELL_GAP;
      const layoutWidth = Math.max(rect.width, gridW);
      const layoutHeight = gridH;
      
      // DPI setup
      const dpi = window.devicePixelRatio || 1;
      const c = canvasRef.current;
      c.width = Math.round(layoutWidth * dpi);
      c.height = Math.round(layoutHeight * dpi);
      c.style.width = `${layoutWidth}px`;
      c.style.height = `${layoutHeight}px`;
      
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
      }

      draw(c);
    };

    updateSize(); // initial size
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSize, 100);
    };

    window.addEventListener("resize", handleResize);

    const timer = setInterval(tick, TICK_MS);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [loading, draw, tick, isMobile]);

  return (
    <div className="ds-card p-0 overflow-hidden" ref={containerRef}>
      {/* Canvas */}
      <div
        ref={viewportRef}
        className="w-full overflow-x-auto overflow-y-hidden"
        style={{ backgroundColor: BG_COLOR }}
      >
        {loading ? (
          <span className="text-sm ds-text-muted animate-pulse">
            Fetching real-time GitHub activity...
          </span>
        ) : errorMsg ? (
          <span className="text-sm text-red-400">
            {errorMsg}
          </span>
        ) : (
          <div className="mx-auto flex w-max min-w-full justify-center">
            <canvas
              ref={canvasRef}
              className="block shrink-0"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        )}
      </div>

      {/* Bottom info bar */}
      <div
        className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-t md:px-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        {stats ? (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm">
              <span className="ds-text-muted">Contributions: </span>
              <span className="font-semibold ds-text-primary">
                {stats.total.toLocaleString()} in last year
              </span>
            </div>
            <div className="text-sm">
              <span className="ds-text-muted">Longest Streak: </span>
              <span className="font-semibold ds-text-primary">
                {stats.maxStreak} days
              </span>
            </div>
            <div className="text-sm md:block hidden">
              <span className="ds-text-muted">Active Days: </span>
              <span className="font-semibold ds-text-primary">
                {stats.activeDays}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-40 h-4 bg-white/5 rounded animate-pulse" />
        )}

        <div className="flex items-center gap-1.5 text-xs ds-text-muted">
          <span>Less</span>
          {LEVEL_COLORS.map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
