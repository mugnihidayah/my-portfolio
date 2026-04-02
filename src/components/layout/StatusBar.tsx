"use client";

import { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { themes } from "@/themes";
import { files } from "@/data/files";
import { profile } from "@/data/profile";
import MotionPresence from "./MotionPresence";
import {
  GitBranch,
  Bell,
  CheckCircle2,
  Terminal,
  Palette,
  Check,
} from "lucide-react";

interface StatusBarProps {
  isMobile?: boolean;
}

export default function StatusBar({ isMobile = false }: StatusBarProps) {
  const { activeTab, toggleTerminal, terminalVisible } = useApp();
  const { currentTheme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const pickerTriggerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [pickerPos, setPickerPos] = useState({ bottom: 0, right: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [bellPos, setBellPos] = useState({ bottom: 0, right: 0 });
  const file = activeTab ? files.find((f) => f.id === activeTab) : null;

  const branchName = activeTab
    ? activeTab.startsWith("project:")
      ? `feature/${activeTab.replace("project:", "")}`
      : activeTab === "home"
        ? "main"
        : `feature/${activeTab}`
    : "main";

  // Calculate the dropdown position
  useEffect(() => {
    if (showThemePicker && pickerTriggerRef.current) {
      const rect = pickerTriggerRef.current.getBoundingClientRect();
      setPickerPos({
        bottom: window.innerHeight - rect.top + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showThemePicker]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        pickerTriggerRef.current &&
        !pickerTriggerRef.current.contains(e.target as Node)
      ) {
        setShowThemePicker(false);
      }
    };

    if (showThemePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showThemePicker]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowThemePicker(false);
    };

    if (showThemePicker) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [showThemePicker]);

  const handleThemeChange = (themeId: string, themeName: string) => {
    setTheme(themeId);
    addToast(`Theme: ${themeName}`, "success");
    setShowThemePicker(false);
  };

  // Notification bell positioning and close
  useEffect(() => {
    if (showNotifications && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setBellPos({
        bottom: window.innerHeight - rect.top + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showNotifications]);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClick = (e: MouseEvent) => {
      if (
        notifRef.current && !notifRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) setShowNotifications(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showNotifications]);

  const problemsText = useCallback(() => {
    if (!activeTab) return "0 Problems";
    const funProblems: Record<string, string> = {
      home: "0 Problems",
      about: "1 Info",
      projects: "0 Problems",
      experience: "0 Problems",
      skills: "2 Warnings",
      contact: "0 Problems",
    };
    return funProblems[activeTab] || "0 Problems";
  }, [activeTab]);

  const notifications = [
    { text: "Welcome to the portfolio!", time: "just now", type: "info" as const },
    { text: "Try the terminal: type 'help'", time: "1m ago", type: "info" as const },
    { text: `Theme: ${currentTheme.name}`, time: "2m ago", type: "success" as const },
    { text: "Press Ctrl+P for commands", time: "5m ago", type: "info" as const },
  ];

  // MOBILE STATUS BAR
  if (isMobile) {
    return (
      <>
        <div
          className="safe-bottom flex min-h-5 items-center justify-between px-2 text-[11px] select-none shrink-0"
          style={{
            backgroundColor: "var(--statusbar-bg)",
            color: "var(--statusbar-fg)",
          }}
        >
          <div className="flex items-center gap-0.5 shrink-0">
            <StatusItem>
              <GitBranch size={10} />
              <span>{branchName}</span>
            </StatusItem>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {file && (
              <StatusItem>
                <span className="truncate max-w-20">{file.language}</span>
              </StatusItem>
            )}

            <div ref={pickerTriggerRef}>
              <StatusItem
                onClick={() => setShowThemePicker((prev) => !prev)}
                active={showThemePicker}
              >
                <Palette size={10} />
              </StatusItem>
            </div>

            <StatusItem>
              <span>🟢</span>
            </StatusItem>
          </div>
        </div>

        {typeof document !== 'undefined' && createPortal(
          <MotionPresence show={showThemePicker} variant="popover" durationMs={180}>
            <ThemePickerDropdown
              ref={pickerRef}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              style={{
                position: "fixed",
                bottom: `${pickerPos.bottom}px`,
                right: `${pickerPos.right}px`,
                zIndex: 9999,
              }}
            />
          </MotionPresence>,
          document.body
        )}
      </>
    );
  }

  // DESKTOP STATUS BAR
  return (
    <>
      <div
        className="flex items-center justify-between h-5.5 px-2 text-[12px] select-none shrink-0 whitespace-nowrap"
        style={{
          backgroundColor: "var(--statusbar-bg)",
          color: "var(--statusbar-fg)",
        }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-0.5 shrink-0">
          <StatusItem>
            <GitBranch size={12} />
              <span>{branchName}</span>
          </StatusItem>

          <StatusItem className="hidden md:flex">
            <CheckCircle2 size={12} />
            <span>{problemsText()}</span>
          </StatusItem>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-0.5 shrink-0">
          <StatusItem onClick={toggleTerminal} active={terminalVisible}>
            <Terminal size={12} />
            <span
              className="hidden lg:inline"
              style={{ opacity: terminalVisible ? 1 : 0.7 }}
            >
              Terminal
            </span>
          </StatusItem>

          {file && (
            <>
              <StatusItem className="hidden lg:flex">
                Ln 1, Col 1
              </StatusItem>
              <StatusItem className="hidden lg:flex">UTF-8</StatusItem>
              <StatusItem>
                <span className="truncate max-w-30">
                  {file.language}
                </span>
              </StatusItem>
            </>
          )}

          {/* Theme Picker Trigger */}
          <div ref={pickerTriggerRef}>
            <StatusItem
              onClick={() => setShowThemePicker((prev) => !prev)}
              active={showThemePicker}
            >
              <Palette size={12} />
              <span className="hidden lg:inline truncate max-w-25">
                {currentTheme.name}
              </span>
            </StatusItem>
          </div>

          <StatusItem>
            <span>🟢</span>
            <span className="hidden lg:inline truncate max-w-25">
              {profile.status}
            </span>
          </StatusItem>

          <div ref={bellRef}>
            <StatusItem
              className="hidden md:flex"
              onClick={() => setShowNotifications((p) => !p)}
              active={showNotifications}
            >
              <Bell size={12} />
            </StatusItem>
          </div>
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <MotionPresence show={showThemePicker} variant="popover" durationMs={180}>
          <ThemePickerDropdown
            ref={pickerRef}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
            style={{
              position: "fixed",
              bottom: `${pickerPos.bottom}px`,
              right: `${pickerPos.right}px`,
              zIndex: 9999,
            }}
          />
        </MotionPresence>,
        document.body
      )}

      {typeof document !== 'undefined' && createPortal(
        <MotionPresence
          show={showNotifications}
          variant="popover"
          durationMs={180}
        >
          <NotificationDropdown
            ref={notifRef}
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            style={{
              position: "fixed",
              bottom: `${bellPos.bottom}px`,
              right: `${bellPos.right}px`,
              zIndex: 9999,
            }}
          />
        </MotionPresence>,
        document.body
      )}
    </>
  );
}

function StatusItem({
  children,
  onClick,
  className = "",
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-state={active ? "active" : "idle"}
      className={`ds-status-pulse flex items-center gap-1 px-1.5 h-full cursor-pointer transition-colors whitespace-nowrap shrink-0 ${className}`}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor =
          "var(--statusbar-hover-bg)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      {children}
    </button>
  );
}

const ThemePickerDropdown = forwardRef<
  HTMLDivElement,
  {
    currentTheme: { id: string; name: string };
    onThemeChange: (themeId: string, themeName: string) => void;
    style?: React.CSSProperties;
  }
>(({ currentTheme, onThemeChange, style }, ref) => {
  return (
    <div
      ref={ref}
      className="w-56 rounded-sm border shadow-xl overflow-hidden"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--border-color)",
        ...style,
      }}
    >
      <div
        className="px-3 py-2 text-[11px] font-medium border-b"
        style={{
          color: "var(--sidebar-header-fg)",
          borderColor: "var(--border-color)",
        }}
      >
        Select Color Theme
      </div>
      <div className="py-1 max-h-70 overflow-y-auto">
        {themes.map((theme) => {
          const isActive = currentTheme.id === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id, theme.name)}
              className="flex items-center gap-2.5 w-full px-3 py-1.5 text-left transition-colors"
              style={{
                backgroundColor: isActive
                  ? "var(--list-active-bg)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor =
                    "var(--list-hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div className="flex gap-0.75 shrink-0">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: theme.colors["--editor-bg"],
                    border: "1px solid var(--border-color)",
                  }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: theme.colors["--accent-color"],
                  }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: theme.colors["--statusbar-bg"],
                  }}
                />
              </div>
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
              {isActive && (
                <Check
                  size={12}
                  className="shrink-0"
                  style={{ color: "var(--accent-color)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

ThemePickerDropdown.displayName = "ThemePickerDropdown";

const NotificationDropdown = forwardRef<
  HTMLDivElement,
  {
    notifications: { text: string; time: string; type: "info" | "success" }[];
    onClose: () => void;
    style?: React.CSSProperties;
  }
>(({ notifications, onClose, style }, ref) => {
  return (
    <div
      ref={ref}
      className="w-64 rounded-sm border shadow-xl overflow-hidden"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--border-color)",
        ...style,
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 text-[11px] font-medium border-b"
        style={{
          color: "var(--sidebar-header-fg)",
          borderColor: "var(--border-color)",
        }}
      >
        <span>Notifications</span>
        <button
          onClick={onClose}
          className="text-[10px] px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer"
          style={{ color: "var(--editor-fg)", opacity: 0.5 }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--list-hover-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          Clear All
        </button>
      </div>
      <div className="py-1 max-h-60 overflow-y-auto">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-3 py-2 transition-colors"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--list-hover-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <div
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{
                backgroundColor:
                  n.type === "success" ? "#4ec9b0" : "var(--accent-color)",
              }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] leading-snug"
                style={{ color: "var(--editor-fg)" }}
              >
                {n.text}
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--editor-fg)", opacity: 0.35 }}
              >
                {n.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

NotificationDropdown.displayName = "NotificationDropdown";
