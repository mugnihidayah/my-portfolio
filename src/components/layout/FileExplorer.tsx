"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { files } from "@/data/files";
import FileIcon from "./FileIcon";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Copy,
  ExternalLink,
  Download,
} from "lucide-react";

interface FileExplorerProps {
  onFileSelect?: () => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  fileId: string;
  fileName: string;
}

export default function FileExplorer({ onFileSelect }: FileExplorerProps) {
  const { openFile, activeTab } = useApp();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const nextIndex = activeTab
      ? files.findIndex((f) => f.id === activeTab)
      : -1;

    const frameId = requestAnimationFrame(() => {
      setFocusedIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeTab]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    fileId: "",
    fileName: "",
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleFileClick = useCallback((fileId: string) => {
    openFile(fileId);
    onFileSelect?.();
  }, [openFile, onFileSelect]);

  const handleContextMenu = (
    e: React.MouseEvent,
    fileId: string,
    fileName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 200);

    setContextMenu({ visible: true, x, y, fileId, fileName });
  };

  // Close context menu
  useEffect(() => {
    const handleClick = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    if (contextMenu.visible) {
      document.addEventListener("click", handleClick);
      document.addEventListener("contextmenu", handleClick);
      document.addEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [contextMenu.visible]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < files.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : files.length - 1
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < files.length) {
            handleFileClick(files[focusedIndex].id);
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(files.length - 1);
          break;
      }
    },
    [isOpen, focusedIndex, handleFileClick]
  );

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const buttons = listRef.current.querySelectorAll("[role='treeitem']");
      buttons[focusedIndex]?.scrollIntoView({ block: "nearest" });
      (buttons[focusedIndex] as HTMLElement)?.focus();
    }
  }, [focusedIndex]);

  const contextMenuActions = [
    {
      label: "Open",
      icon: FileText,
      action: () => {
        openFile(contextMenu.fileId);
        onFileSelect?.();
      },
    },
    {
      label: "Open to the Side",
      icon: ExternalLink,
      action: () => {
        openFile(contextMenu.fileId);
        onFileSelect?.();
      },
    },
    { type: "separator" as const },
    {
      label: "Copy Name",
      icon: Copy,
      action: () => {
        navigator.clipboard?.writeText(contextMenu.fileName);
        addToast(`Copied: ${contextMenu.fileName}`, "success");
      },
    },
    {
      label: "Copy Path",
      icon: Copy,
      action: () => {
        const file = files.find((item) => item.id === contextMenu.fileId);
        if (!file) return;

        navigator.clipboard?.writeText(file.path);
        addToast(`Copied: ${file.path}`, "success");
      },
    },
    { type: "separator" as const },
    ...(contextMenu.fileId === "resume"
      ? [
          {
            label: "Download Resume",
            icon: Download,
            action: () => {
              const link = document.createElement("a");
              link.href = "/resume.pdf";
              link.download = "Mugni_Hidayah_Resume.pdf";
              link.click();
              addToast("Downloading resume...", "info");
            },
          },
        ]
      : []),
  ];

  return (
    <div className="text-[13px]" onKeyDown={handleKeyDown}>
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 w-full px-2 py-1 font-semibold text-[11px] uppercase tracking-wider hover:bg-(--hover-bg) transition-colors"
        style={{ color: "var(--sidebar-header-fg)" }}
        aria-expanded={isOpen}
        aria-label="Portfolio files"
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        Portfolio
      </button>

      {isOpen && (
        <div className="px-2 pb-1.5 flex items-center gap-1.5 text-[10px] ds-text-faint">
          <span className="ds-kbd">↑</span>
          <span className="ds-kbd">↓</span>
          <span className="ds-kbd">Enter</span>
        </div>
      )}

      {/* File List */}
      {isOpen && (
        <div ref={listRef} role="tree" aria-label="File Explorer">
          {files.map((file, index) => {
            const isActive = activeTab === file.id;
            const isFocused = focusedIndex === index;

            return (
              <button
                key={file.id}
                role="treeitem"
                tabIndex={isFocused ? 0 : -1}
                aria-selected={isActive}
                aria-label={`${file.name} — ${file.language}`}
                onClick={() => {
                  setFocusedIndex(index);
                  handleFileClick(file.id);
                }}
                onContextMenu={(e) =>
                  handleContextMenu(e, file.id, file.name)
                }
                onFocus={() => setFocusedIndex(index)}
                data-state={isActive ? "active" : "inactive"}
                className="ds-list-row ds-list-row-soft flex items-center gap-2 w-full pl-6 pr-4 py-0.75 text-left outline-none"
                style={{
                  backgroundColor: isActive
                    ? "var(--list-active-bg)"
                    : isFocused
                    ? "var(--list-hover-bg)"
                    : "transparent",
                  color: "var(--sidebar-fg)",
                  boxShadow: isFocused
                    ? "inset 0 0 0 1px var(--focus-border)"
                    : "none",
                }}
              >
                <FileIcon extension={file.extension} size={16} />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed z-9999 min-w-45 py-1 rounded-sm border shadow-xl"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          {contextMenuActions.map((item, i) => {
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

            return (
              <button
                key={i}
                onClick={() => {
                  if ("action" in item) item.action();
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="ds-list-row ds-list-row-soft flex items-center gap-2.5 w-full px-3 py-1.5 text-left text-[12px]"
                style={{ color: "var(--editor-fg)" }}
              >
                {Icon && (
                  <Icon
                    size={13}
                    style={{ color: "var(--editor-fg)", opacity: 0.5 }}
                  />
                )}
                <span>{"label" in item ? item.label : ""}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
