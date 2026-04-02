"use client";

import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { themes } from "@/themes";
import {
  Palette,
  Check,
  Zap,
  Keyboard,
  Search,
  Terminal,
  MessageSquare,
  FileDown,
  Maximize,
} from "lucide-react";

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();
  const { toggleTerminal, openChatPanel, openCommandPalette } = useApp();
  const { addToast } = useToast();

  const handleThemeChange = (themeId: string, themeName: string) => {
    setTheme(themeId);
    addToast(`Theme: ${themeName}`, "success");
  };

  const quickActions = [
    {
      icon: Search,
      label: "Command Palette",
      shortcut: "Ctrl+P",
      action: openCommandPalette,
    },
    {
      icon: Terminal,
      label: "Toggle Terminal",
      shortcut: "Ctrl+`",
      action: toggleTerminal,
    },
    {
      icon: MessageSquare,
      label: "Copilot Chat",
      action: openChatPanel,
    },
    {
      icon: FileDown,
      label: "Download Resume",
      action: () => {
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Mugni_Hidayah_Resume.pdf";
        link.click();
        addToast("Downloading resume...", "info");
      },
    },
    {
      icon: Maximize,
      label: "Toggle Fullscreen",
      shortcut: "F11",
      action: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      },
    },
  ];

  const shortcuts = [
    { keys: ["Ctrl P"], description: "Go to file (command palette)" },
    { keys: ["Ctrl `"], description: "Toggle terminal" },
    { keys: ["Ctrl B"], description: "Toggle sidebar" },
    { keys: ["Esc"], description: "Close overlay" },
    { keys: ["\u2191 / \u2193"], description: "Terminal history" },
  ];

  return (
    <div className="space-y-1">
      {/* Color Theme Section */}
      <SectionHeader icon={Palette} title="COLOR THEME" />

      <div className="px-2 pb-3">
        {themes.map((theme) => {
          const isActive = currentTheme.id === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleThemeChange(theme.id, theme.name)}
              className="ds-list-row px-3 py-2 text-left"
              data-state={isActive ? "active" : "inactive"}
            >
              {/* Color Preview */}
              <div className="flex gap-0.5 shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: theme.colors["--editor-bg"],
                    border: "1px solid var(--border-color)",
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.colors["--accent-color"] }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.colors["--statusbar-bg"] }}
                />
              </div>

              {/* Name */}
              <span
                className="flex-1 text-[12px] truncate"
                style={{
                  color: isActive
                    ? "var(--tab-active-fg)"
                    : "var(--sidebar-fg)",
                }}
              >
                {theme.name}
              </span>

              {/* Active Check */}
              {isActive && (
                <Check
                  size={14}
                  className="shrink-0"
                  style={{ color: "var(--accent-color)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div
        className="h-px mx-4"
        style={{ backgroundColor: "var(--border-color)" }}
      />

      {/* Quick Actions Section */}
      <SectionHeader icon={Zap} title="QUICK ACTIONS" />

      <div className="px-2 pb-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.action}
              className="ds-list-row px-3 py-2 text-left"
            >
              <Icon
                size={14}
                style={{ color: "var(--accent-color)" }}
                className="shrink-0"
              />
              <span
                className="flex-1 text-[12px]"
                style={{ color: "var(--sidebar-fg)" }}
              >
                {action.label}
              </span>
              {action.shortcut && (
                <span
                  className="text-[10px]"
                  style={{ color: "var(--editor-line-number)" }}
                >
                  {action.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div
        className="h-px mx-4"
        style={{ backgroundColor: "var(--border-color)" }}
      />

      {/* Keyboard Shortcuts Section */}
      <SectionHeader icon={Keyboard} title="KEYBOARD SHORTCUTS" />

      <div className="px-2 pb-4 space-y-1">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.description}
            className="flex items-center gap-3 px-3 py-1.5"
          >
            <div className="flex items-center gap-1 shrink-0">
              {shortcut.keys.map((key) => (
                <kbd
                  key={key}
                  className="ds-kbd"
                >
                  {key}
                </kbd>
              ))}
            </div>
            <span
              className="text-[11px]"
              style={{ color: "var(--editor-fg)", opacity: 0.6 }}
            >
              {shortcut.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5">
      <Icon size={14} style={{ color: "var(--accent-color)" }} />
      <span
        className="text-[11px] font-medium tracking-wider"
        style={{ color: "var(--sidebar-header-fg)" }}
      >
        {title}
      </span>
    </div>
  );
}
