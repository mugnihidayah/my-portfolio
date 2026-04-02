"use client";

import { useApp, type SidebarPanel } from "@/context/AppContext";
import { Files, Search, Puzzle, Bot, Settings, type LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarActivity {
  type: "sidebar";
  id: SidebarPanel;
  icon: LucideIcon;
  label: string;
  mobileLabel: string;
  showOnMobile: boolean;
}

interface ChatActivity {
  type: "chat";
  icon: LucideIcon;
  label: string;
  mobileLabel: string;
  showOnMobile: boolean;
}

type Activity = (SidebarActivity | ChatActivity) & {
  position: "top" | "bottom";
};

const activities: Activity[] = [
  {
    type: "sidebar",
    id: "explorer",
    icon: Files,
    label: "Explorer",
    mobileLabel: "Files",
    showOnMobile: true,
    position: "top",
  },
  {
    type: "sidebar",
    id: "search",
    icon: Search,
    label: "Search",
    mobileLabel: "Search",
    showOnMobile: true,
    position: "top",
  },
  {
    type: "sidebar",
    id: "extensions",
    icon: Puzzle,
    label: "Skills & Tools",
    mobileLabel: "Skills",
    showOnMobile: true,
    position: "top",
  },
  {
    type: "chat",
    icon: Bot,
    label: "AI Chat",
    mobileLabel: "Chat",
    showOnMobile: false,
    position: "top",
  },
  {
    type: "sidebar",
    id: "settings",
    icon: Settings,
    label: "Settings",
    mobileLabel: "Settings",
    showOnMobile: true,
    position: "bottom",
  },
];

interface ActivityBarProps {
  isMobile?: boolean;
  onOpenSidebar?: (panel: SidebarPanel) => void;
}

export default function ActivityBar({
  isMobile = false,
  onOpenSidebar,
}: ActivityBarProps) {
  const {
    activeSidebarPanel,
    setSidebarPanel,
    sidebarVisible,
    chatPanelVisible,
    toggleChatPanel,
  } = useApp();

  const topItems = activities.filter((a) => a.position === "top");
  const bottomItems = activities.filter((a) => a.position === "bottom");

  // MOBILE BOTTOM NAV
  if (isMobile) {
    // Filter: only show items where showOnMobile = true
    const mobileItems = [...topItems, ...bottomItems].filter(
      (a) => a.showOnMobile
    );

    return (
      <div
        className="grid grid-cols-4 shrink-0 border-t"
        style={{
          backgroundColor: "var(--activitybar-bg)",
          borderColor: "var(--border-color)",
          minHeight: "72px",
        }}
      >
        {mobileItems.map((item, i) => {
          const Icon = item.icon;
          const isSidebar = item.type === "sidebar";

          const onClick = () => {
            if (isSidebar) {
              setSidebarPanel(item.id);
              onOpenSidebar?.(item.id);
            }
          };

          const isActive = isSidebar
            ? sidebarVisible && activeSidebarPanel === item.id
            : false;

          return (
            <button
              key={i}
              onClick={onClick}
              className="flex min-h-18 flex-col items-center justify-center gap-1 px-1.5 pt-1 transition-colors active:scale-95"
              style={{
                color: isActive
                  ? "var(--activitybar-fg)"
                  : "var(--activitybar-inactive-fg)",
              }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                }}
              >
                <Icon size={19} />
              </span>
              <span className="text-[10px] font-medium leading-tight">
                {item.mobileLabel}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // DESKTOP ACTIVITY BAR
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="flex flex-col items-center justify-between w-12 py-1 select-none shrink-0"
        style={{ backgroundColor: "var(--activitybar-bg)" }}
      >
        {/* Top Icons */}
        <div className="flex flex-col items-center">
          {topItems.map((item, i) => {
            const isActive =
              item.type === "sidebar"
                ? sidebarVisible && activeSidebarPanel === item.id
                : chatPanelVisible;

            const onClick =
              item.type === "sidebar"
                ? () => setSidebarPanel(item.id)
                : () => toggleChatPanel();

            return (
              <ActivityIcon
                key={i}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                onClick={onClick}
              />
            );
          })}
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center">
          {bottomItems.map((item, i) => {
            const isActive =
              item.type === "sidebar"
                ? sidebarVisible && activeSidebarPanel === item.id
                : chatPanelVisible;

            const onClick =
              item.type === "sidebar"
                ? () => setSidebarPanel(item.id)
                : () => toggleChatPanel();

            return (
              <ActivityIcon
                key={i}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                onClick={onClick}
              />
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

function ActivityIcon({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="relative w-12 h-12 flex items-center justify-center transition-colors"
          style={{
            color: isActive
              ? "var(--activitybar-fg)"
              : "var(--activitybar-inactive-fg)",
          }}
        >
          {isActive && (
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5"
              style={{
                backgroundColor: "var(--activitybar-active-border)",
              }}
            />
          )}
          <Icon size={24} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <p className="text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
