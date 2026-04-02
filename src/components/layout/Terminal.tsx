"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

import { commandList } from "@/data/commands";
import { themes } from "@/themes";
import { profile } from "@/data/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Terminal as TerminalIcon } from "lucide-react";

const CLI_SPINNER_FRAMES = ["|", "/", "-", "\\"];

interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "success" | "system" | "ascii";
  content: string;
  animate?: boolean;
}

function TypewriterLine({ content, color, animate = true }: { content: string, color: string, animate?: boolean }) {
  const [displayedText, setDisplayedText] = useState(animate ? "" : content);

  useEffect(() => {
    if (!animate) return;
    
    let index = 0;
    setDisplayedText(""); // Reset
    
    const interval = setInterval(() => {
      index++;
      if (index <= content.length) {
        setDisplayedText(content.substring(0, index));
      } else {
        clearInterval(interval);
      }
    }, 10); // Extremely fast shell output typing

    return () => clearInterval(interval);
  }, [content, animate]);

  return (
    <div style={{ color }} className="relative break-all pr-2">
      {displayedText}
      {animate && displayedText.length < content.length && (
        <span className="inline-block w-2 h-3.5 ml-0.5 bg-current align-middle animate-pulse" />
      )}
    </div>
  );
}

function CliSpinner() {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % CLI_SPINNER_FRAMES.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  return <span className="text-(--accent-color) ml-2">{CLI_SPINNER_FRAMES[frame]} thinking...</span>;
}

const WELCOME_LINES: TerminalLine[] = [
  {
    id: 0,
    type: "system",
    content: `Welcome to ${profile.name}'s Portfolio Terminal`,
    animate: false,
  },
  {
    id: 1,
    type: "system",
    content: "Type 'help' to see available commands.\n",
    animate: false,
  },
];

let lineCounter = 2;

interface TerminalProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Terminal({ isMobile = false, onClose }: TerminalProps) {
  const { openFile, toggleTerminal } = useApp();
  const { currentTheme, setTheme } = useTheme();
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, isThinking]);

  useEffect(() => {
    // Small delay for mobile sheet animation
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, isMobile ? 300 : 0);
    return () => clearTimeout(timer);
  }, [isMobile]);

  const addLines = useCallback((newLines: Omit<TerminalLine, "id" | "animate">[], animate = true) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((line) => ({ ...line, id: lineCounter++, animate })),
    ]);
  }, []);

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      addLines([{ type: "input", content: trimmed }], false);
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      const [cmd, ...args] = trimmed.toLowerCase().split(" ");
      const argsText = args.join(" ");

      switch (cmd) {
        case "help": {
          const helpLines: Omit<TerminalLine, "id" | "animate">[] = [
            { type: "output", content: "\n📋 Available commands:\n" },
            ...commandList.map((c) => ({
              type: "output" as const,
              content: `  ${(c.usage || c.name).padEnd(20)} ${c.description}`,
            })),
            { type: "output", content: "" },
          ];
          addLines(helpLines);
          break;
        }

        case "about":
        case "projects":
        case "skills":
        case "experience":
        case "contact":
        case "home": {
          setIsThinking(true);
          setTimeout(() => {
            setIsThinking(false);
            openFile(cmd);
            addLines([{ type: "success", content: `📄 Opened ${cmd} tab` }]);
            if (isMobile) {
              if (onClose) onClose();
              else toggleTerminal();
            }
          }, 400);
          break;
        }

        case "resume": {
          addLines([
            { type: "success", content: "📥 Downloading resume..." },
          ]);
          // Trigger download
          const link = document.createElement("a");
          link.href = "/resume.pdf";
          link.download = "Mugni_Hidayah_Resume.pdf";
          link.click();
          break;
        }

        case "clear": {
          setLines([]);
          lineCounter = 0;
          break;
        }

        case "whoami": {
          setIsThinking(true);
          setTimeout(() => {
            setIsThinking(false);
            addLines([
              {
                type: "output",
                content:
                  "👋 You are a visitor exploring Mugni Hidayah's portfolio!",
              },
            ]);
          }, 800);
          break;
        }

        case "date": {
          addLines([
            {
              type: "output",
              content: `📅 ${new Date().toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}`,
            },
          ]);
          break;
        }

        case "echo": {
          if (!argsText) {
            addLines([{ type: "error", content: "Usage: echo <text>" }]);
          } else {
            addLines([{ type: "output", content: argsText }]);
          }
          break;
        }

        case "theme": {
          if (!argsText) {
            addLines([
              {
                type: "error",
                content:
                  "Usage: theme <name>. Type 'themes' to see available themes.",
              },
            ]);
          } else {
            const matchedTheme = themes.find(
              (t) =>
                t.id === argsText ||
                t.name.toLowerCase().includes(argsText)
            );
            if (matchedTheme) {
              setTheme(matchedTheme.id);
              addLines([
                {
                  type: "success",
                  content: `🎨 Theme changed to '${matchedTheme.name}'`,
                },
              ]);
            } else {
              addLines([
                {
                  type: "error",
                  content: `Theme '${argsText}' not found. Type 'themes' to see available themes.`,
                },
              ]);
            }
          }
          break;
        }

        case "themes": {
          addLines([
            { type: "output", content: "\n🎨 Available themes:\n" },
            ...themes.map((t) => ({
              type: "output" as const,
              content: `  ${t.id === currentTheme.id ? "● " : "  "}${t.id.padEnd(16)} ${t.name}`,
            })),
            {
              type: "system",
              content: `\n  Current: ${currentTheme.name}`,
            },
            { type: "output", content: "" },
          ]);
          break;
        }

        case "neofetch": {
          const asciiArt = [
            { type: "ascii" as const, content: "" },
            {
              type: "ascii" as const,
              content: "    ██╗   ██╗██╗  ██╗",
            },
            {
              type: "ascii" as const,
              content: "    ███╗ ███║██║  ██║",
            },
            {
              type: "ascii" as const,
              content: "    ████████║███████║",
            },
            {
              type: "ascii" as const,
              content: "    ██╔═██╔═╝██╔══██║",
            },
            {
              type: "ascii" as const,
              content: "    ██║ ██║  ██║  ██║",
            },
            {
              type: "ascii" as const,
              content: "    ╚═╝ ╚═╝  ╚═╝  ╚═╝",
            },
            { type: "ascii" as const, content: "" },
            {
              type: "output" as const,
              content: `  👤 ${profile.name}`,
            },
            {
              type: "output" as const,
              content: `  💼 ${profile.role}`,
            },
            {
              type: "output" as const,
              content: `  📍 ${profile.location}`,
            },
            {
              type: "output" as const,
              content: `  🟢 ${profile.status}`,
            },
            {
              type: "output" as const,
              content: `  🖥️  Next.js + Tailwind CSS`,
            },
            {
              type: "output" as const,
              content: `  🎨 Theme: ${currentTheme.name}`,
            },
            { type: "output" as const, content: "" },
          ];
          addLines(asciiArt);
          break;
        }

        case "secret": {
          const secretLines = [
            { type: "success" as const, content: "" },
            {
              type: "success" as const,
              content: "🎉 You found the secret!",
            },
            { type: "success" as const, content: "" },
            {
              type: "output" as const,
              content: "  Fun facts about me:",
            },
            {
              type: "output" as const,
              content: "  🎮 I love playing video games",
            },
            {
              type: "output" as const,
              content: "  ☕ Coffee is my fuel",
            },
            {
              type: "output" as const,
              content: "  🤖 I talk to AI more than humans",
            },
            { type: "output" as const, content: "" },
            {
              type: "system" as const,
              content: "  Thanks for exploring!",
            },
            { type: "output" as const, content: "" },
          ];
          addLines(secretLines);
          break;
        }

        default: {
          addLines([
            {
              type: "error",
              content: `Command not found: ${cmd}. Type 'help' for available commands.`,
            },
          ]);
        }
      }
    },
    [addLines, openFile, setTheme, currentTheme, isMobile, onClose, toggleTerminal]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isThinking) {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
      lineCounter = 0;
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "var(--tab-active-fg)";
      case "output":
        return "var(--editor-fg)";
      case "error":
        return "#f44747";
      case "success":
        return "#4ec9b0";
      case "system":
        return "var(--accent-color)";
      case "ascii":
        return "var(--accent-color)";
      default:
        return "var(--editor-fg)";
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      toggleTerminal();
    }
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: "var(--panel-bg)" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Panel Header */}
      <div
        className={`flex items-center justify-between px-4 shrink-0 border-t ${
          isMobile ? "h-10" : "h-8.75"
        }`}
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1.5 text-xs font-medium pb-px border-b"
            style={{
              color: "var(--tab-active-fg)",
              borderColor: "var(--accent-color)",
            }}
          >
            <TerminalIcon size={12} />
            TERMINAL
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="p-1 rounded-sm hover:bg-white/10 transition-colors"
            style={{ color: "var(--editor-fg)", opacity: 0.6 }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <ScrollArea className="flex-1">
        <div
          className={`py-2 leading-5 ${
            isMobile ? "px-3 text-[12px]" : "px-4 text-[13px]"
          }`}
        >
          {isMobile && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="ds-panel-hint">Quick commands</span>
              {["help", "projects", "resume"].map((command) => (
                <button
                  key={command}
                  type="button"
                  onClick={() => executeCommand(command)}
                  className="ds-chip px-2.5 py-1 text-[11px]"
                >
                  {command}
                </button>
              ))}
            </div>
          )}

          {lines.map((line) => (
            <div key={line.id} className="whitespace-pre-wrap">
              {line.type === "input" ? (
                <div className="flex items-start gap-0 flex-wrap">
                  <span style={{ color: "#4ec9b0" }}>visitor</span>
                  <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>@</span>
                  <span style={{ color: "#569cd6" }}>mugni</span>
                  <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>:~$ </span>
                  <span style={{ color: getLineColor(line.type) }}>
                    {line.content}
                  </span>
                </div>
              ) : line.type === "ascii" ? (
                <div style={{ color: getLineColor(line.type) }}>
                  {line.content}
                </div>
              ) : (
                <TypewriterLine 
                  content={line.content} 
                  color={getLineColor(line.type)} 
                  animate={line.animate} 
                />
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-0 my-1">
              <span style={{ color: "#4ec9b0" }}>system</span>
              <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>@</span>
              <span style={{ color: "#569cd6" }}>ai</span>
              <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>:~$ </span>
              <CliSpinner />
            </div>
          )}

          <div className="flex items-center gap-0 mt-1">
            <span style={{ color: "#4ec9b0" }}>visitor</span>
            <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>@</span>
            <span style={{ color: "#569cd6" }}>mugni</span>
            <span style={{ color: "var(--editor-fg)", opacity: 0.5 }}>:~$ </span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent outline-none ${
                  isMobile ? "text-[12px]" : "text-[13px]"
                }`}
                style={{
                  color: "var(--tab-active-fg)",
                  caretColor: "var(--accent-color)",
                  outline: "none",
                  boxShadow: "none",
                }}
                spellCheck={false}
                disabled={isThinking}
                autoComplete="off"
                placeholder={isMobile ? "Type a command..." : ""}
              />
            </div>
          </div>

          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
