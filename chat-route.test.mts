import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "./src/app/api/chat/route.ts";
import { resetRateLimitStoreForTests } from "./src/lib/rateLimit.ts";

function makeRequest(body: unknown, ip = "203.0.113.10") {
  return new Request("https://example.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

test.beforeEach(async () => {
  await resetRateLimitStoreForTests();
  delete process.env.GROQ_API_KEY;
});

test.afterEach(() => {
  delete process.env.GROQ_API_KEY;
});

test("chat route returns a JSON error when GROQ_API_KEY is missing", async () => {
  const response = await POST(
    makeRequest({ messages: [{ role: "user", content: "hello" }] })
  );
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.equal(body.error, "Chat service is temporarily unavailable.");
});

test("chat route validates invalid message payloads before calling upstream", async () => {
  process.env.GROQ_API_KEY = "test-key";

  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response("unexpected");
  }) as typeof fetch;

  try {
    const response = await POST(makeRequest({ messages: "not-an-array" }));
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      body.error,
      "Invalid messages payload. Expected up to 20 non-empty chat messages."
    );
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("chat route streams upstream content and forwards rate limit headers", async () => {
  process.env.GROQ_API_KEY = "test-key";

  const originalFetch = globalThis.fetch;
  let capturedBody: unknown = null;

  globalThis.fetch = (async (_url, init) => {
    capturedBody = init?.body ? JSON.parse(String(init.body)) : null;
    return new Response(
      'data: {"choices":[{"delta":{"content":"Hello "}}]}\n' +
        'data: {"choices":[{"delta":{"content":"world"}}]}\n' +
        "data: [DONE]\n",
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
        },
      }
    );
  }) as typeof fetch;

  try {
    const response = await POST(
      makeRequest({
        messages: [{ role: "user", content: "Tell me about Synapse." }],
        context: { mode: "recruiter", activeTab: "project:synapse" },
      })
    );

    assert.equal(response.status, 200);
    assert.equal(await response.text(), "Hello world");
    assert.equal(response.headers.get("X-RateLimit-Limit"), "10");
    assert.equal(response.headers.get("X-RateLimit-Remaining"), "9");
    assert.ok(Array.isArray((capturedBody as { messages?: unknown[] })?.messages));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("chat route returns 429 after the chat rate limit is exceeded", async () => {
  process.env.GROQ_API_KEY = "test-key";

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response('data: {"choices":[{"delta":{"content":"ok"}}]}\n')) as typeof fetch;

  try {
    for (let index = 0; index < 10; index += 1) {
      const response = await POST(
        makeRequest(
          { messages: [{ role: "user", content: `hello ${index}` }] },
          "198.51.100.20"
        )
      );
      assert.equal(response.status, 200);
    }

    const blocked = await POST(
      makeRequest(
        { messages: [{ role: "user", content: "blocked please" }] },
        "198.51.100.20"
      )
    );
    const body = await blocked.json();

    assert.equal(blocked.status, 429);
    assert.equal(body.error, "Too many requests. Please try again later.");
    assert.equal(blocked.headers.get("X-RateLimit-Remaining"), "0");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
