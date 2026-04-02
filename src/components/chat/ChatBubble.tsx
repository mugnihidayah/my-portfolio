"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useChatContext } from "@/context/ChatContext";
import { useMobile } from "@/hooks/useMobile";
import type { ChatInlineAction, ChatQuickAction } from "@/lib/chatAssistant";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatAssistantTools from "./ChatAssistantTools";
import { Bot, Trash2, Send, Square, X, CornerDownLeft, Sparkles } from "lucide-react";

export default function ChatBubble() {
  const isMobile = useMobile();
  const { chatPanelVisible, openChatPanel, closeChatPanel, openFile } = useApp();
  const [localInput, setLocalInput] = useState("");
  const {
    messages,
    isLoading,
    mode,
    setMode,
    stop,
    error,
    sendMessage,
    suggestedPrompts,
    quickActions,
    contextTitle,
    contextDescription,
    resetChat,
  } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatPanelVisible) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
    }
  }, [chatPanelVisible, messages]);

  if (!isMobile) return null;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    sendMessage(localInput);
    setLocalInput("");
  };

  const handlePromptSelect = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  const handleQuickActionSelect = (
    action: ChatQuickAction | ChatInlineAction
  ) => {
    openFile(action.targetTab, { sectionId: action.sectionId });
    closeChatPanel();
  };

  const lastMessage = messages[messages.length - 1];
  const showTyping =
    isLoading && !(lastMessage?.role === "assistant" && lastMessage.content);

  return (
    <>
      {!chatPanelVisible && (
        <button
          type="button"
          onClick={openChatPanel}
          className="mobile-floating-offset fixed right-4 z-50 flex h-12 items-center justify-center gap-2 rounded-full px-4 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
          style={{
            backgroundColor: "var(--accent-color)",
          }}
          aria-label="Open AI assistant"
        >
          <Bot size={22} color="#ffffff" />
          <span className="text-[13px] font-medium text-white">Ask AI</span>
        </button>
      )}

      <Sheet
        open={chatPanelVisible}
        onOpenChange={(open) => {
          if (open) {
            openChatPanel();
            return;
          }
          closeChatPanel();
        }}
      >
        <SheetContent
          side="bottom"
          className="mobile-sheet-padding h-[84vh] p-0! rounded-t-xl flex flex-col [&>button]:hidden border-t"
          style={{
            backgroundColor: "var(--panel-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <SheetHeader className="p-0! space-y-0! shrink-0">
            <div
              className="mx-auto mt-2 h-1.5 w-12 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
            />
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "var(--panel-border)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--active-bg)" }}
                >
                  <Bot size={15} style={{ color: "var(--accent-color)" }} />
                </div>
                <SheetTitle
                  className="text-sm! font-medium! m-0!"
                  style={{ color: "var(--tab-active-fg)" }}
                >
                  AI Assistant
                </SheetTitle>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  className="p-1.5 rounded-sm transition-colors"
                  style={{ color: "var(--editor-fg)", opacity: 0.5 }}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={closeChatPanel}
                  className="p-1.5 rounded-sm transition-colors"
                  style={{ color: "var(--editor-fg)", opacity: 0.5 }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                <ChatAssistantTools
                  mode={mode}
                  contextTitle={contextTitle}
                  contextDescription={contextDescription}
                  suggestedPrompts={suggestedPrompts}
                  quickActions={quickActions}
                  onModeChange={setMode}
                  onPromptSelect={handlePromptSelect}
                  onQuickActionSelect={handleQuickActionSelect}
                />

                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    actions={message.actions}
                    onActionSelect={handleQuickActionSelect}
                  />
                ))}

                {showTyping && (
                  <div className="flex gap-2.5">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: "var(--active-bg)" }}
                    >
                      <Bot size={12} style={{ color: "var(--accent-color)" }} />
                    </div>
                    <div
                      className="min-w-0 flex-1 rounded-lg rounded-tl-sm border px-3 py-2"
                      style={{
                        backgroundColor: "var(--active-bg)",
                        borderColor: "rgba(0, 122, 204, 0.18)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <TypingDots />
                        <span className="text-[11px] font-medium ds-text-primary">
                          Thinking through your portfolio context...
                        </span>
                      </div>
                      <div className="mt-2 ds-loading-shell">
                        <div className="ds-loading-line ds-loading-line-md w-[88%]" />
                        <div className="ds-loading-line ds-loading-line-md w-[70%]" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div
                    className="rounded-sm border px-3 py-2 text-[12px]"
                    style={{
                      backgroundColor: "rgba(244, 71, 71, 0.1)",
                      color: "#f44747",
                      borderColor: "rgba(244, 71, 71, 0.2)",
                    }}
                  >
                    <div className="font-medium">Couldn&apos;t complete that reply</div>
                    <div className="mt-1 opacity-90">{error}</div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </div>

          <div
            className="border-t px-3 py-3 shrink-0"
            style={{
              borderColor: "var(--panel-border)",
              backgroundColor: "var(--panel-bg)",
            }}
          >
            <form onSubmit={onSubmit} className="flex gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder={
                  mode === "recruiter"
                    ? "Ask like a recruiter or hiring manager..."
                    : "Ask about Mugni..."
                }
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
                className="ds-input h-9 flex-1 min-w-0 px-3 text-[11.5px] placeholder:text-[11px] disabled:opacity-50"
              />

              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-sm shrink-0"
                  style={{
                    backgroundColor: "#f44747",
                    color: "#ffffff",
                  }}
                  aria-label="Stop generating response"
                >
                  <Square size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!localInput.trim()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-sm shrink-0 transition-colors"
                  style={{
                    backgroundColor: localInput.trim()
                      ? "var(--accent-color)"
                      : "var(--active-bg)",
                    color: localInput.trim()
                      ? "#ffffff"
                      : "var(--editor-line-number)",
                    opacity: localInput.trim() ? 1 : 0.95,
                    border: `1px solid ${
                      localInput.trim()
                        ? "var(--accent-color)"
                        : "var(--border-color)"
                    }`,
                  }}
                  aria-label="Send message"
                >
                  <Send size={14} strokeWidth={2.2} />
                </button>
              )}
            </form>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="ds-panel-hint">
                <Sparkles size={12} />
                Ask about projects, resume fit, stack decisions, or next steps
              </div>
              <div className="flex items-center gap-1">
                <span className="ds-kbd">Enter</span>
                <span className="ds-panel-hint flex items-center gap-1">
                  <CornerDownLeft size={11} />
                  send
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function TypingDots() {
  return (
    <div className="flex h-5 items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full animate-bounce"
          style={{
            backgroundColor: "var(--accent-color)",
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}
