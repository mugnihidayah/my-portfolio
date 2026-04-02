export interface RateLimitStore {
  consume(
    identifier: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult>;
  clear?(): void | Promise<void>;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  limit: number;
  resetAt: number;
}

class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>();

  async consume(identifier: string, config: RateLimitConfig) {
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;

    cleanupExpiredEntries(this.store, now);

    const existing = this.store.get(identifier);

    if (!existing || now >= existing.resetAt) {
      const resetAt = now + windowMs;
      this.store.set(identifier, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: Math.max(config.maxRequests - 1, 0),
        retryAfterSeconds: 0,
        limit: config.maxRequests,
        resetAt,
      };
    }

    if (existing.count < config.maxRequests) {
      const nextCount = existing.count + 1;
      const updatedEntry = { ...existing, count: nextCount };
      this.store.set(identifier, updatedEntry);

      return {
        allowed: true,
        remaining: Math.max(config.maxRequests - nextCount, 0),
        retryAfterSeconds: 0,
        limit: config.maxRequests,
        resetAt: updatedEntry.resetAt,
      };
    }

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        Math.ceil((existing.resetAt - now) / 1000),
        1
      ),
      limit: config.maxRequests,
      resetAt: existing.resetAt,
    };
  }

  clear() {
    this.store.clear();
  }
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class UpstashRateLimitStore implements RateLimitStore {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async consume(identifier: string, config: RateLimitConfig) {
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const key = `portfolio:ratelimit:${identifier}`;

    const response = await fetch(`${this.baseUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PTTL", key],
        ["PEXPIRE", key, String(windowMs), "NX"],
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Upstash rate limit request failed: ${response.status}`);
    }

    const payload = (await response.json()) as Array<{ result?: unknown }>;
    const count = toSafeInteger(payload[0]?.result, 0);
    const ttlMs =
      toSafeInteger(payload[1]?.result, windowMs) > 0
        ? toSafeInteger(payload[1]?.result, windowMs)
        : windowMs;
    const resetAt = now + ttlMs;

    return {
      allowed: count <= config.maxRequests,
      remaining: Math.max(config.maxRequests - count, 0),
      retryAfterSeconds:
        count <= config.maxRequests ? 0 : Math.max(Math.ceil(ttlMs / 1000), 1),
      limit: config.maxRequests,
      resetAt,
    };
  }

  clear() {
    // Remote stores are not cleared automatically outside tests.
  }
}

function toSafeInteger(value: unknown, fallback: number) {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createDefaultRateLimitStore(): RateLimitStore {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (baseUrl && token) {
    return new UpstashRateLimitStore(baseUrl, token);
  }

  return new MemoryRateLimitStore();
}

function cleanupExpiredEntries(store: Map<string, RateLimitEntry>, now: number) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return;
  lastCleanupAt = now;

  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  }
}

declare global {
  var __portfolioRateLimitStore__: RateLimitStore | undefined;
}

function resolveRateLimitStore(store?: RateLimitStore) {
  if (store) return store;

  if (!globalThis.__portfolioRateLimitStore__) {
    globalThis.__portfolioRateLimitStore__ = createDefaultRateLimitStore();
  }

  return globalThis.__portfolioRateLimitStore__;
}

/**
 * Production-oriented rate limiting foundation.
 * Uses Upstash Redis when configured, with an in-memory fallback for local development.
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanupAt = Date.now();

export function setRateLimitStore(store: RateLimitStore) {
  globalThis.__portfolioRateLimitStore__ = store;
}

export async function resetRateLimitStoreForTests() {
  await resolveRateLimitStore().clear?.();
  globalThis.__portfolioRateLimitStore__ = new MemoryRateLimitStore();
  lastCleanupAt = Date.now();
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
  store?: RateLimitStore
): Promise<RateLimitResult> {
  const activeStore = resolveRateLimitStore(store);

  try {
    return await activeStore.consume(identifier, config);
  } catch (error) {
    if (activeStore instanceof MemoryRateLimitStore) {
      throw error;
    }

    const fallbackStore = new MemoryRateLimitStore();
    globalThis.__portfolioRateLimitStore__ = fallbackStore;
    return fallbackStore.consume(identifier, config);
  }
}

export function createRateLimitHeaders(result: RateLimitResult) {
  return {
    "Retry-After": String(result.retryAfterSeconds),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

export function getClientIdentifier(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfIp = req.headers.get("cf-connecting-ip");
  const forwarded = req.headers.get("forwarded");

  if (cfIp?.trim()) return cfIp.trim();
  if (realIp?.trim()) return realIp.trim();
  if (forwardedFor?.trim()) return forwardedFor.split(",")[0].trim();

  if (forwarded?.trim()) {
    const match = forwarded.match(/for=(?:"?\[?)([^;"\],]+)(?:\]?"?)/i);
    if (match?.[1]) return match[1].trim();
  }

  const userAgent = req.headers.get("user-agent")?.trim();
  return userAgent ? `ua:${userAgent}` : "unknown-client";
}

export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
      retryAfterSeconds: result.retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...createRateLimitHeaders(result),
      },
    }
  );
}
