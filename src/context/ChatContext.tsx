"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useApp } from "./AppContext";
import {
  ChatInlineAction,
  ChatMode,
  ChatQuickAction,
  ChatSuggestedPrompt,
  getChatContextInfo,
  getInlineActionsForAssistantMessage,
  getQuickActions,
  getSuggestedPrompts,
  getWelcomeMessage,
} from "@/lib/chatAssistant";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: ChatInlineAction[];
}

interface ChatContextType {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  mode: ChatMode;
  contextTitle: string;
  contextDescription: string;
  suggestedPrompts: ChatSuggestedPrompt[];
  quickActions: ChatQuickAction[];
  setMode: (mode: ChatMode) => void;
  setInput: (value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  sendMessage: (text: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  resetChat: () => void;
  stop: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { activeTab } = useApp();
  const [mode, setMode] = useState<ChatMode>("general");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: getWelcomeMessage({ mode: "general", activeTab }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  messagesRef.current = messages;

  const contextInfo = useMemo(
    () => getChatContextInfo({ mode, activeTab }),
    [mode, activeTab]
  );
  const suggestedPrompts = useMemo(
    () => getSuggestedPrompts({ mode, activeTab }),
    [mode, activeTab]
  );
  const quickActions = useMemo(
    () => getQuickActions({ mode, activeTab }),
    [mode, activeTab]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  }, []);

  const resetChat = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage({ mode, activeTab }),
      },
    ]);
    setError(null);
    setInput("");
  }, [mode, activeTab]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setError(null);
      setInput("");

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const currentMessages = messagesRef.current;
      const updatedMessages = [...currentMessages, userMessage];

      const assistantId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages([...updatedMessages, assistantMessage]);
      setIsLoading(true);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages
              .filter((message) => message.id !== "welcome")
              .map((message) => ({
                role: message.role,
                content: message.content,
              })),
            context: {
              mode,
              activeTab,
            },
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: fullContent }
                : message
            )
          );
        }

        const remaining = decoder.decode();
        if (remaining) {
          fullContent += remaining;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: fullContent }
                : message
            )
          );
        }

        if (!fullContent.trim()) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content:
                      "Sorry, I can't respond at this time. Please try again.",
                  }
                : message
            )
          );
        } else {
          const inlineActions = getInlineActionsForAssistantMessage(
            fullContent,
            {
              mode,
              activeTab,
            },
            trimmed
          );

          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, actions: inlineActions }
                : message
            )
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);

        setMessages((prev) =>
          prev.filter(
            (message) => !(message.id === assistantId && !message.content.trim())
          )
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [activeTab, mode]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        input,
        isLoading,
        error,
        mode,
        contextTitle: contextInfo.title,
        contextDescription: contextInfo.description,
        suggestedPrompts,
        quickActions,
        setMode,
        setInput,
        handleInputChange,
        handleSubmit,
        sendMessage,
        setMessages,
        resetChat,
        stop,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
