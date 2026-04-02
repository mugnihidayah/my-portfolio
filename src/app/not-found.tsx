"use client";

import { Code2, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--editor-bg)" }}
    >
      <div className="text-center space-y-6 px-4">
        {/* VS Code style icon */}
        <div className="flex justify-center">
          <Code2 size={48} style={{ color: "var(--accent-color)" }} />
        </div>

        {/* Error code */}
        <div>
          <h1
            className="text-6xl font-bold"
            style={{ color: "var(--accent-color)" }}
          >
            404
          </h1>
          <p
            className="text-lg mt-2"
            style={{ color: "var(--editor-fg)", opacity: 0.7 }}
          >
            File not found
          </p>
        </div>

        {/* Terminal-style message */}
        <div
          className="max-w-md mx-auto rounded-sm p-4 text-left text-[13px] leading-6"
          style={{
            backgroundColor: "var(--panel-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center gap-1">
            <span style={{ color: "#4ec9b0" }}>visitor</span>
            <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>@</span>
            <span style={{ color: "#569cd6" }}>mugni</span>
            <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>:~$ </span>
            <span style={{ color: "var(--editor-fg)" }}>cat page</span>
          </div>
          <div style={{ color: "#f44747" }}>
            Error: The requested file does not exist in this workspace.
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span style={{ color: "#4ec9b0" }}>visitor</span>
            <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>@</span>
            <span style={{ color: "#569cd6" }}>mugni</span>
            <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>:~$ </span>
            <span
              className="inline-block w-2 h-4 animate-pulse"
              style={{ backgroundColor: "var(--editor-fg)" }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent-color)", color: "#ffffff" }}
          >
            <Home size={14} />
            Open Workspace
          </Link>
        </div>

        {/* Status bar */}
        <div
          className="fixed bottom-0 left-0 right-0 h-5.5 flex items-center justify-between px-3 text-[12px]"
          style={{ backgroundColor: "var(--accent-color)", color: "#ffffff" }}
        >
          <span>⚠ Page Not Found</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
