"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useApp } from "@/context/AppContext";
import { resolveTabFile } from "@/data/files";
import { prefetchPage } from "./Editor";
import FileIcon from "./FileIcon";
import {
  X,
  XCircle,
  ArrowRightToLine,
  Copy,
} from "lucide-react";

interface TabBarProps {
  isMobile?: boolean;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  tabId: string;
}

export default function TabBar({ isMobile = false }: TabBarProps) {
  const {
    openTabs,
    activeTab,
    setActiveTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToRight,
    reorderTabs,
  } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [closingTabs, setClosingTabs] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    tabId: "",
  });
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);
  const dragTabId = useRef<string | null>(null);

  useEffect(() => {
    if (isMobile && activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab, isMobile]);

  // Close context menu on click/escape
  useEffect(() => {
    if (!contextMenu.visible) return;

    const handleClick = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        setContextMenu((prev) => ({ ...prev, visible: false }));
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [contextMenu.visible]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const x = Math.min(e.clientX, window.innerWidth - 200);
      const y = Math.min(e.clientY, window.innerHeight - 200);
      setContextMenu({ visible: true, x, y, tabId });
    },
    []
  );

  const handleCloseTab = useCallback(
    (tabId: string) => {
      const el = tabRefs.current.get(tabId);

      if (!el) {
        closeTab(tabId);
        return;
      }

      setClosingTabs((prev) => new Set(prev).add(tabId));

      const currentWidth = el.offsetWidth;
      el.style.width = `${currentWidth}px`;
      el.style.minWidth = "0";
      el.style.overflow = "hidden";

      requestAnimationFrame(() => {
        el.style.transition =
          "width var(--ds-motion-duration-normal) var(--ds-motion-ease-emphasized), " +
          "opacity var(--ds-motion-duration-fast) var(--ds-motion-ease-standard), " +
          "padding var(--ds-motion-duration-normal) var(--ds-motion-ease-emphasized)";
        el.style.width = "0";
        el.style.opacity = "0";
        el.style.paddingLeft = "0";
        el.style.paddingRight = "0";
      });

      setTimeout(() => {
        closeTab(tabId);
        setClosingTabs((prev) => {
          const next = new Set(prev);
          next.delete(tabId);
          return next;
        });
        tabRefs.current.delete(tabId);
      }, 260);
    },
    [closeTab]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto shrink-0 scrollbar-none ${
          isMobile ? "h-9" : "h-8.75"
        }`}
        style={{
          backgroundColor: "var(--tabs-bg)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {openTabs.map((tabId) => {
          const file = resolveTabFile(tabId);
          if (!file) return null;

          const isActive = activeTab === tabId;
          const isClosing = closingTabs.has(tabId);

          return (
            <div
              key={tabId}
              data-state={isActive ? "active" : "inactive"}
              ref={(el) => {
                if (isActive) activeTabRef.current = el;
                if (el) tabRefs.current.set(tabId, el);
              }}
              className="ds-tab group flex items-center gap-1.5 px-3 h-full cursor-pointer shrink-0 relative"
              style={{
                backgroundColor: isActive
                  ? "var(--tab-active-bg)"
                  : "var(--tab-inactive-bg)",
                color: isActive
                  ? "var(--tab-active-fg)"
                  : "var(--tab-inactive-fg)",
                borderRight: "1px solid var(--tab-border)",
                minWidth: isMobile ? "100px" : "120px",
                maxWidth: isMobile ? "160px" : "200px",
                pointerEvents: isClosing ? "none" : "auto",
              }}
              onClick={() => !isClosing && setActiveTab(tabId)}
              onMouseEnter={() => prefetchPage(tabId)}
              onContextMenu={(e) => !isMobile && handleContextMenu(e, tabId)}
              draggable={!isMobile && !isClosing}
              onDragStart={(e) => {
                dragTabId.current = tabId;
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragTabId.current !== tabId) setDragOverTabId(tabId);
              }}
              onDragLeave={() => setDragOverTabId(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverTabId(null);
                if (dragTabId.current && dragTabId.current !== tabId) {
                  const fromIdx = openTabs.indexOf(dragTabId.current);
                  const toIdx = openTabs.indexOf(tabId);
                  if (fromIdx !== -1 && toIdx !== -1) reorderTabs(fromIdx, toIdx);
                }
                dragTabId.current = null;
              }}
              onDragEnd={() => {
                setDragOverTabId(null);
                dragTabId.current = null;
              }}
            >
              <div
                data-state={isActive ? "active" : "inactive"}
                className="ds-tab-indicator absolute top-0 left-0 right-0 h-px"
                style={{ backgroundColor: "var(--accent-color)" }}
              />
              {dragOverTabId === tabId && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ backgroundColor: "var(--accent-color)" }}
                />
              )}

              <FileIcon
                extension={file.extension}
                size={isMobile ? 12 : 14}
              />
              <span
                className={`truncate flex-1 ${
                  isMobile ? "text-[12px]" : "text-[13px]"
                }`}
              >
                {file.name}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isClosing) handleCloseTab(tabId);
                }}
                className={`p-0.5 rounded-sm hover:bg-white/10 focus-visible:bg-white/10 transition-opacity ${
                  isActive
                    ? "opacity-60 hover:opacity-100"
                    : isMobile
                      ? "opacity-0"
                      : "opacity-0 group-hover:opacity-60 hover:opacity-100!"
                }`}
                aria-label={`Close ${file.name}`}
              >
                <X size={isMobile ? 12 : 14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <TabContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          tabId={contextMenu.tabId}
          openTabs={openTabs}
          onClose={closeContextMenu}
          onCloseTab={handleCloseTab}
          onCloseOthers={closeOtherTabs}
          onCloseRight={closeTabsToRight}
          onCloseAll={closeAllTabs}
        />
      )}
    </>
  );
}

function TabContextMenu({
  x,
  y,
  tabId,
  openTabs,
  onClose,
  onCloseTab,
  onCloseOthers,
  onCloseRight,
  onCloseAll,
}: {
  x: number;
  y: number;
  tabId: string;
  openTabs: string[];
  onClose: () => void;
  onCloseTab: (id: string) => void;
  onCloseOthers: (id: string) => void;
  onCloseRight: (id: string) => void;
  onCloseAll: () => void;
}) {
  const tabIdx = openTabs.indexOf(tabId);
  const canCloseOthers = openTabs.length > 1;
  const canCloseRight = tabIdx < openTabs.length - 1;

  const items = [
    { label: "Close", icon: X, action: () => onCloseTab(tabId) },
    { label: "Close Others", icon: XCircle, disabled: !canCloseOthers, action: () => onCloseOthers(tabId) },
    { label: "Close to the Right", icon: ArrowRightToLine, disabled: !canCloseRight, action: () => onCloseRight(tabId) },
    { type: "separator" as const },
    { label: "Close All", icon: X, action: () => onCloseAll() },
    { type: "separator" as const },
    {
      label: "Copy Path",
      icon: Copy,
      action: () => {
        const file = resolveTabFile(tabId);
        if (file) navigator.clipboard?.writeText(file.path);
      },
    },
  ];

  return (
    <div
      className="fixed z-9999 min-w-48 py-1 rounded-sm border shadow-xl"
      style={{
        left: x,
        top: y,
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {items.map((item, i) => {
        if ("type" in item && item.type === "separator") {
          return (
            <div
              key={`sep-${i}`}
              className="my-1 h-px mx-2"
              style={{ backgroundColor: "var(--border-color)" }}
            />
          );
        }

        const Icon = "icon" in item ? item.icon : null;
        const isDisabled = "disabled" in item && item.disabled;

        return (
          <button
            key={i}
            disabled={isDisabled}
            onClick={() => {
              if ("action" in item && !isDisabled) item.action();
              onClose();
            }}
            className="ds-list-row ds-list-row-soft flex items-center gap-2.5 w-full px-3 py-1.5 text-left text-[12px] disabled:opacity-30"
            style={{ color: "var(--editor-fg)" }}
          >
            {Icon && (
              <Icon size={13} style={{ color: "var(--editor-fg)", opacity: 0.5 }} />
            )}
            <span>{"label" in item ? item.label : ""}</span>
          </button>
        );
      })}
    </div>
  );
}
