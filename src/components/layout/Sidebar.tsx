"use client";

import { useApp } from "@/context/AppContext";
import FileExplorer from "./FileExplorer";
import ThemeSelector from "./ThemeSelector";
import SearchPanel from "./SearchPanel";
import ExtensionsPanel from "./ExtensionsPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

const panelTitles: Record<string, string> = {
  explorer: "EXPLORER",
  search: "SEARCH",
  extensions: "EXTENSIONS",
  settings: "SETTINGS",
};

interface SidebarProps {
  isMobile?: boolean;
  onFileSelect?: () => void;
}

export default function Sidebar({
  isMobile = false,
  onFileSelect,
}: SidebarProps) {
  const { activeSidebarPanel } = useApp();
  const needsInteraction =
    activeSidebarPanel === "settings" ||
    activeSidebarPanel === "search" ||
    activeSidebarPanel === "extensions";

  return (
    <div
      className={`h-full flex flex-col overflow-hidden ${
        needsInteraction ? "" : "select-none"
      } ${isMobile ? "w-full" : "w-60 shrink-0 border-r"}`}
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderColor: isMobile ? undefined : "var(--border-color)",
        minWidth: isMobile ? undefined : "240px",
        maxWidth: isMobile ? undefined : "240px",
      }}
    >
      {/* Header */}
      <div
        className="h-10 flex items-center px-5 text-[11px] font-normal tracking-widest uppercase shrink-0"
        style={{ color: "var(--sidebar-header-fg)" }}
      >
        {panelTitles[activeSidebarPanel] || "EXPLORER"}
      </div>

      {/* Panel Tabs (Mobile only) */}
      {isMobile && (
        <div
          className="flex border-b shrink-0 overflow-x-auto scrollbar-none px-2"
          style={{ borderColor: "var(--border-color)" }}
        >
          <MobilePanelTab panel="explorer" label="Explorer" />
          <MobilePanelTab panel="search" label="Search" />
          <MobilePanelTab panel="extensions" label="Skills" />
          <MobilePanelTab panel="settings" label="Settings" />
        </div>
      )}

      {/* Content */}
      {activeSidebarPanel === "search" ? (
        <SearchPanel onFileSelect={onFileSelect} />
      ) : activeSidebarPanel === "settings" ? (
        <div className="flex-1 overflow-y-auto">
          <ThemeSelector />
        </div>
      ) : activeSidebarPanel === "extensions" ? (
        <ExtensionsPanel onFileSelect={onFileSelect} />
      ) : (
        <ScrollArea className="flex-1">
          {activeSidebarPanel === "explorer" && (
            <FileExplorer onFileSelect={onFileSelect} />
          )}
        </ScrollArea>
      )}
    </div>
  );
}

function MobilePanelTab({
  panel,
  label,
}: {
  panel: "explorer" | "search" | "extensions" | "settings";
  label: string;
}) {
  const { activeSidebarPanel, setSidebarPanel } = useApp();
  const isActive = activeSidebarPanel === panel;

  return (
    <button
      onClick={() => setSidebarPanel(panel)}
      className="px-3 py-3 text-[11px] font-medium whitespace-nowrap transition-colors relative"
      style={{
        color: isActive
          ? "var(--tab-active-fg)"
          : "var(--tab-inactive-fg)",
      }}
    >
      {label}
      {isActive && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: "var(--accent-color)" }}
        />
      )}
    </button>
  );
}
