import { generateSystemPrompt } from "@/lib/generatePrompt";
import {
  checkRateLimit,
  createRateLimitHeaders,
  getClientIdentifier,
  rateLimitResponse,
} from "@/lib/rateLimit";
import type { ChatRequestContext } from "@/lib/chatAssistant";

// Chat: 10 requests per 60 seconds per IP
const CHAT_RATE_LIMIT = { maxRequests: 10, windowSeconds: 60 };
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

function isValidMessageArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.length <= MAX_MESSAGES &&
    value.every(
      (message) =>
        message &&
        typeof message === "object" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= MAX_MESSAGE_LENGTH
    )
  );
}

export async function POST(req: Request) {
  // Rate limit check
  const clientId = getClientIdentifier(req);
  const rateLimit = await checkRateLimit(
    `chat:${clientId}`,
    CHAT_RATE_LIMIT
  );
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  if (!process.env.GROQ_API_KEY) {
    return jsonResponse(
      { error: "Chat service is temporarily unavailable." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const messages = body?.messages;
    const context = body?.context as Partial<ChatRequestContext> | undefined;

    if (!isValidMessageArray(messages)) {
      return jsonResponse(
        {
          error:
            "Invalid messages payload. Expected up to 20 non-empty chat messages.",
        },
        { status: 400, headers: createRateLimitHeaders(rateLimit) }
      );
    }

    const chatContext: ChatRequestContext = {
      mode: context?.mode === "recruiter" ? "recruiter" : "general",
      activeTab: context?.activeTab ?? null,
    };
    const systemPrompt = generateSystemPrompt(chatContext);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[Chat API] Groq error:", response.status, error);
      return jsonResponse(
        { error: "Upstream AI service is temporarily unavailable." },
        {
          status: 502,
          headers: createRateLimitHeaders(rateLimit),
        }
      );
    }

    if (!response.body) {
      return jsonResponse(
        { error: "No response body from Groq" },
        {
          status: 502,
          headers: createRateLimitHeaders(rateLimit),
        }
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let totalContent = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();

              if (!trimmed || trimmed === "data: [DONE]") {
                continue;
              }

              if (trimmed.startsWith("data: ")) {
                try {
                  const json = JSON.parse(trimmed.slice(6));
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    totalContent += content;
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // skip malformed JSON chunks
                }
              }
            }
          }

          // Process remaining buffer
          if (buffer.trim() && buffer.trim() !== "data: [DONE]") {
            if (buffer.trim().startsWith("data: ")) {
              try {
                const json = JSON.parse(buffer.trim().slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  totalContent += content;
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // skip
              }
            }
          }

          // If there is no content at all, send a fallback
          if (!totalContent) {
            controller.enqueue(
              encoder.encode("Sorry, I can't respond at this time. Please try again!")
            );
          }
        } catch (err) {
          console.error("[Chat API] Stream error:", err);
          controller.enqueue(
            encoder.encode("An error occurred while processing the response.")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        ...createRateLimitHeaders(rateLimit),
      },
    });
  } catch (err) {
    console.error("[Chat API] Request error:", err);
    return jsonResponse(
      { error: "Chat service is temporarily unavailable." },
      {
        status: 500,
        headers: createRateLimitHeaders(rateLimit),
      }
    );
  }
}
