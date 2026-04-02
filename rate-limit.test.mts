import assert from "node:assert/strict";
import test from "node:test";

import {
  checkRateLimit,
  createRateLimitHeaders,
  getClientIdentifier,
  rateLimitResponse,
  resetRateLimitStoreForTests,
} from "./src/lib/rateLimit.ts";

test.beforeEach(async () => {
  await resetRateLimitStoreForTests();
});

test("checkRateLimit blocks requests after the configured limit", async () => {
  const config = { maxRequests: 2, windowSeconds: 60 };

  const first = await checkRateLimit("chat:test-ip", config);
  const second = await checkRateLimit("chat:test-ip", config);
  const third = await checkRateLimit("chat:test-ip", config);

  assert.equal(first.allowed, true);
  assert.equal(first.remaining, 1);
  assert.equal(second.allowed, true);
  assert.equal(second.remaining, 0);
  assert.equal(third.allowed, false);
  assert.equal(third.remaining, 0);
  assert.ok(third.retryAfterSeconds >= 1);
});

test("getClientIdentifier prefers proxy headers in a stable order", () => {
  const request = new Request("https://example.com/api/chat", {
    headers: {
      "cf-connecting-ip": "203.0.113.1",
      "x-real-ip": "203.0.113.2",
      "x-forwarded-for": "203.0.113.3, 203.0.113.4",
      "user-agent": "test-agent",
    },
  });

  assert.equal(getClientIdentifier(request), "203.0.113.1");
});

test("rateLimitResponse returns JSON with standard rate limit headers", async () => {
  const first = await checkRateLimit("contact:test-ip", {
    maxRequests: 1,
    windowSeconds: 60,
  });
  const blocked = await checkRateLimit("contact:test-ip", {
    maxRequests: 1,
    windowSeconds: 60,
  });

  assert.equal(first.allowed, true);
  const response = rateLimitResponse(blocked);
  const body = await response.json();
  const headers = createRateLimitHeaders(blocked);

  assert.equal(response.status, 429);
  assert.equal(body.error, "Too many requests. Please try again later.");
  assert.equal(response.headers.get("Retry-After"), headers["Retry-After"]);
  assert.equal(
    response.headers.get("X-RateLimit-Limit"),
    headers["X-RateLimit-Limit"]
  );
  assert.equal(
    response.headers.get("X-RateLimit-Remaining"),
    headers["X-RateLimit-Remaining"]
  );
});
