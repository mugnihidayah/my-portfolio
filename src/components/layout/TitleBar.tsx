"use client";

import { Minus, Square, X, Code2, Search, Menu, Terminal } from "lucide-react";
import { profile } from "@/data/profile";

const menuItems = [
  "File",
  "Edit",
  "Selection",
  "View",
  "Go",
  "Terminal",
  "Help",
];

interface TitleBarProps {
  onOpenCommandPalette?: () => void;
  isMobile?: boolean;
  onOpenSidebar?: () => void;
  onOpenTerminal?: () => void;
}

export default function TitleBar({
  onOpenCommandPalette,
  isMobile = false,
  onOpenSidebar,
  onOpenTerminal,
}: TitleBarProps) {
  // MOBILE TITLE BAR
  if (isMobile) {
    return (
      <div
        className="flex items-center h-13 px-3 select-none shrink-0 gap-2"
        style={{
          backgroundColor: "var(--titlebar-bg)",
          color: "var(--titlebar-fg)",
        }}
      >
        {/* Hamburger Menu */}
        <button
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-sm hover:bg-white/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Logo + Title */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Code2 size={16} className="text-blue-500" />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">
              {profile.name}
            </div>
            <div className="truncate text-[10px] opacity-55">
              Portfolio workspace
            </div>
          </div>
        </div>

        {/* Search / Command Palette */}
        <button
          onClick={onOpenCommandPalette}
          className="flex h-10 w-10 items-center justify-center rounded-sm hover:bg-white/10 transition-colors"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        {/* Terminal toggle */}
        <button
          onClick={onOpenTerminal}
          className="flex h-10 w-10 items-center justify-center rounded-sm hover:bg-white/10 transition-colors"
          aria-label="Open terminal"
        >
          <Terminal size={16} />
        </button>
      </div>
    );
  }

  // DESKTOP TITLE BAR
  return (
    <div
      className="flex items-center h-7.5 px-2 select-none shrink-0"
      style={{
        backgroundColor: "var(--titlebar-bg)",
        color: "var(--titlebar-fg)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <Code2 size={16} className="text-blue-500" />
      </div>

      {/* Menu Items */}
      <div className="flex items-center gap-0.5 shrink-0">
        {menuItems.map((item) => (
          <button
            key={item}
            className="px-2 py-0.5 text-[13px] rounded-sm hover:bg-white/10 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Center — Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center w-full max-w-100 px-3 py-0.5 rounded-md text-[12px] transition-colors"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "var(--titlebar-fg)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(255, 255, 255, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(255, 255, 255, 0.05)")
          }
        >
          <Search size={12} style={{ opacity: 0.5 }} />
          <span className="flex-1 text-center" style={{ opacity: 0.6 }}>
            {profile.name} — Portfolio
          </span>
          <span className="w-3" aria-hidden="true" />
        </button>
      </div>

      {/* Window Controls */}
      <div className="flex items-center -mr-2 shrink-0">
        <button className="h-7.5 w-11.5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Minus size={14} />
        </button>
        <button className="h-7.5 w-11.5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Square size={11} />
        </button>
        <button className="h-7.5 w-11.5 flex items-center justify-center hover:bg-[#e81123] transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
