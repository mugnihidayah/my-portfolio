import { Resend } from "resend";
import {
  checkRateLimit,
  createRateLimitHeaders,
  getClientIdentifier,
  rateLimitResponse,
} from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

const RESEND_VERIFIED_EMAIL =
  process.env.RESEND_VERIFIED_EMAIL || "mugnihidayah11@gmail.com";

// Contact: 3 requests per 5 minutes per IP (emails are expensive)
const CONTACT_RATE_LIMIT = { maxRequests: 3, windowSeconds: 300 };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 2000;

function sanitizeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  // Rate limit check
  const clientId = getClientIdentifier(req);
  const rateLimit = await checkRateLimit(
    `contact:${clientId}`,
    CONTACT_RATE_LIMIT
  );
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  if (!process.env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Contact service is temporarily unavailable." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(rateLimit),
          },
        }
      );
  }

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(rateLimit),
          },
        }
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Name must be under ${MAX_NAME_LENGTH} characters` }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(rateLimit),
          },
        }
      );
    }

    if (!EMAIL_REGEX.test(email) || email.length > MAX_EMAIL_LENGTH) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(rateLimit),
          },
        }
      );
    }

    if (message.length < MIN_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters` }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(rateLimit),
          },
        }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(rateLimit),
          },
        }
      );
    }

    // Sanitize for HTML email template
    const safeName = sanitizeHtml(name);
    const safeEmail = sanitizeHtml(email);
    const safeMessage = sanitizeHtml(message);

    const { error } = await resend.emails.send({
      from: "Mugni Hidayah <onboarding@resend.dev>",
      to: RESEND_VERIFIED_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007acc; border-bottom: 2px solid #007acc; padding-bottom: 8px;">
            New Message from Portfolio
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 80px;">From:</td>
              <td style="padding: 8px 12px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 12px;">
                <a href="mailto:${safeEmail}" style="color: #007acc;">${safeEmail}</a>
              </td>
            </tr>
          </table>

          <div style="background: #f5f5f5; padding: 16px; border-radius: 4px; margin: 16px 0;">
            <p style="font-weight: bold; color: #555; margin: 0 0 8px 0;">Message:</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Reply to this email to respond directly to ${safeName} (${safeEmail})
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Contact API] Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(rateLimit),
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...createRateLimitHeaders(rateLimit),
        },
      }
    );
  } catch (err) {
    console.error("[Contact API] Error:", err);
    return new Response(
      JSON.stringify({ error: "Contact service is temporarily unavailable." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...createRateLimitHeaders(rateLimit),
        },
      }
    );
  }
}
