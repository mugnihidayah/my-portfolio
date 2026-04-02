"use client";

import { Briefcase, FolderOpen, MessageSquareText } from "lucide-react";
import {
  ChatMode,
  ChatQuickAction,
  ChatSuggestedPrompt,
} from "@/lib/chatAssistant";

interface ChatAssistantToolsProps {
  mode: ChatMode;
  contextTitle: string;
  contextDescription: string;
  suggestedPrompts: ChatSuggestedPrompt[];
  quickActions: ChatQuickAction[];
  onModeChange: (mode: ChatMode) => void;
  onPromptSelect: (prompt: string) => void;
  onQuickActionSelect: (action: ChatQuickAction) => void;
}

export default function ChatAssistantTools({
  mode,
  contextTitle,
  contextDescription,
  suggestedPrompts,
  quickActions,
  onModeChange,
  onPromptSelect,
  onQuickActionSelect,
}: ChatAssistantToolsProps) {
  return (
    <div className="ds-card p-3 space-y-2.5">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div
            className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em]"
            style={{ color: "var(--sidebar-header-fg)" }}
          >
            <MessageSquareText size={12} />
            Assistant context
          </div>

          <div
            className="flex shrink-0 rounded-sm border p-0.5"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--active-bg)",
            }}
          >
            {(["general", "recruiter"] as const).map((value) => {
              const isActive = mode === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onModeChange(value)}
                  className="px-2 py-0.75 text-[10.5px] font-medium rounded-sm transition-colors"
                  style={{
                    backgroundColor: isActive
                      ? "var(--accent-color)"
                      : "transparent",
                    color: isActive ? "#ffffff" : "var(--editor-fg)",
                    opacity: isActive ? 1 : 0.75,
                  }}
                >
                  {value === "general" ? "General" : "Recruiter"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 space-y-1">
          <p
            className="text-[12px] font-semibold"
            style={{ color: "var(--tab-active-fg)" }}
          >
            {contextTitle}
          </p>
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: "var(--editor-fg)", opacity: 0.68 }}
          >
            {contextDescription}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em]"
          style={{ color: "var(--sidebar-header-fg)" }}
        >
          <Briefcase size={12} />
          Suggested prompts
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => onPromptSelect(prompt.prompt)}
              className="ds-chip px-2.5 py-1 text-[10.5px] text-left"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em]"
          style={{ color: "var(--sidebar-header-fg)" }}
        >
          <FolderOpen size={12} />
          Quick actions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onQuickActionSelect(action)}
              className="inline-flex h-8 items-center justify-center rounded-sm border px-2.5 text-[10px] font-medium transition-colors hover:bg-white/5"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--editor-fg)",
                backgroundColor: "transparent",
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
