"use client";

import { useMemo } from "react";
import { ArrowRight, Bot, User } from "lucide-react";
import type { ChatInlineAction } from "@/lib/chatAssistant";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  actions?: ChatInlineAction[];
  onActionSelect?: (action: ChatInlineAction) => void;
}

export default function ChatMessage({
  role,
  content,
  actions = [],
  onActionSelect,
}: ChatMessageProps) {
  const isUser = role === "user";
  const formattedContent = useMemo(() => parseContent(content), [content]);

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: isUser ? "var(--accent-color)" : "var(--active-bg)",
        }}
      >
        {isUser ? (
          <User size={12} color="#fff" />
        ) : (
          <Bot size={12} style={{ color: "var(--accent-color)" }} />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`min-w-0 px-2.5 py-1.5 rounded-lg text-[12px] leading-relaxed whitespace-pre-wrap select-text cursor-text ${
          isUser ? "rounded-tr-sm" : "rounded-tl-sm"
        }`}
        style={{
          backgroundColor: isUser
            ? "var(--accent-color)"
            : "var(--active-bg)",
          color: isUser ? "#ffffff" : "var(--editor-fg)",
          maxWidth: "calc(100% - 32px)",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          WebkitUserSelect: "text",
          userSelect: "text",
        }}
      >
        {formattedContent}

        {!isUser && actions.length > 0 && onActionSelect && (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onActionSelect(action);
                }}
                className="ds-chip inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[11px] font-medium hover:-translate-y-0.5"
                style={{
                  borderColor: "rgba(0, 122, 204, 0.28)",
                  backgroundColor: "rgba(0, 122, 204, 0.12)",
                  color: "var(--accent-color)",
                }}
              >
                <span>{action.label}</span>
                <ArrowRight size={11} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Parse content string
 */
function parseContent(text: string): React.ReactNode[] {
  if (!text) return [];

  // Regex patterns
  const combinedRegex =
    /(\*\*(.+?)\*\*)|(`([^`]+)`)|((https?:\/\/[^\s<>\]\)]+))|(\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\))/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[4]) {
      // `inline code`
      parts.push(
        <code
          key={match.index}
          className="px-1 py-0.5 rounded text-[11px] font-medium"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          {match[4]}
        </code>
      );
    } else if (match[2]) {
      // **bold**
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[8] && match[9]) {
      // [text](url) — markdown link
      parts.push(
        <a
          key={match.index}
          href={match[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 decoration-1 hover:opacity-80 transition-opacity inline-flex items-center gap-0.5"
          style={{ color: "var(--accent-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {match[8]}
          <ExternalLinkIcon />
        </a>
      );
    } else if (match[5]) {
      // Raw URL — https://...
      const url = match[5].replace(/[.,;:!?]+$/, ""); // trim trailing punctuation
      const trailing = match[5].slice(url.length); // keep trailing punctuation as text

      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 decoration-1 hover:opacity-80 transition-opacity inline-flex items-center gap-0.5"
          style={{ color: "var(--accent-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {prettifyUrl(url)}
          <ExternalLinkIcon />
        </a>
      );

      if (trailing) {
        parts.push(trailing);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If there is no match at all, return the original text
  if (parts.length === 0) {
    return [text];
  }

  return parts;
}

/**
 * Make URLs more readable
 */
function prettifyUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const display = parsed.hostname + parsed.pathname;
    // Hapus trailing slash
    return display.endsWith("/") ? display.slice(0, -1) : display;
  } catch {
    return url;
  }
}

/**
 * Tiny external link icon
 */
function ExternalLinkIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block shrink-0 opacity-60"
      style={{ marginTop: "-1px" }}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
