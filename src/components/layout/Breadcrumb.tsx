"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/context/AppContext";
import { resolveTabFile, files } from "@/data/files";
import { projects } from "@/data/projects";
import FileIcon from "./FileIcon";
import { ChevronRight, FolderOpen } from "lucide-react";

// Pages available in the "pages" folder
const pageFiles = files.filter((f) => !f.id.startsWith("project:"));

export default function Breadcrumb() {
  const { activeTab, openFile } = useApp();
  const [dropdown, setDropdown] = useState<{
    type: "pages" | "projects" | null;
    x: number;
    y: number;
  }>({ type: null, x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const file = activeTab ? resolveTabFile(activeTab) : null;
  if (!activeTab || !file) return null;

  const isProjectDetail = activeTab.startsWith("project:");

  const openDropdown = (
    type: "pages" | "projects",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdown({
      type,
      x: rect.left,
      y: rect.bottom + 2,
    });
  };

  const handleSelect = (fileId: string) => {
    openFile(fileId);
    setDropdown({ type: null, x: 0, y: 0 });
  };

  return (
    <>
      <div
        className="flex items-center gap-1 h-6 px-3 text-[11px] shrink-0 overflow-hidden"
        style={{
          backgroundColor: "var(--editor-bg)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <FolderOpen
          size={12}
          className="shrink-0"
          style={{ color: "var(--editor-line-number)" }}
        />
        <button
          onClick={() => openFile("home")}
          className="shrink-0 transition-opacity hover:opacity-100 cursor-pointer"
          style={{ color: "var(--editor-fg)", opacity: 0.5 }}
        >
          Portfolio
        </button>
        <ChevronRight
          size={10}
          className="shrink-0"
          style={{ color: "var(--editor-fg)", opacity: 0.3 }}
        />
        <span
          className="shrink-0"
          style={{ color: "var(--editor-fg)", opacity: 0.5 }}
        >
          src
        </span>
        <ChevronRight
          size={10}
          className="shrink-0"
          style={{ color: "var(--editor-fg)", opacity: 0.3 }}
        />

        {isProjectDetail ? (
          <>
            <button
              onClick={(e) => openDropdown("projects", e)}
              className="shrink-0 transition-opacity hover:opacity-100 cursor-pointer"
              style={{ color: "var(--accent-color)", opacity: 0.7 }}
            >
              projects
            </button>
            <ChevronRight
              size={10}
              className="shrink-0"
              style={{ color: "var(--editor-fg)", opacity: 0.3 }}
            />
          </>
        ) : (
          <>
            <button
              onClick={(e) => openDropdown("pages", e)}
              className="shrink-0 transition-opacity hover:opacity-100 cursor-pointer"
              style={{ color: "var(--editor-fg)", opacity: 0.5 }}
            >
              pages
            </button>
            <ChevronRight
              size={10}
              className="shrink-0"
              style={{ color: "var(--editor-fg)", opacity: 0.3 }}
            />
          </>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <FileIcon extension={file.extension} size={12} />
          <span style={{ color: "var(--tab-active-fg)" }}>{file.name}</span>
        </div>
      </div>

      {dropdown.type &&
        createPortal(
          <BreadcrumbDropdown
            ref={dropdownRef}
            type={dropdown.type}
            x={dropdown.x}
            y={dropdown.y}
            activeTab={activeTab}
            onSelect={handleSelect}
            onClose={() => setDropdown({ type: null, x: 0, y: 0 })}
          />,
          document.body
        )}
    </>
  );
}

import { forwardRef } from "react";

const BreadcrumbDropdown = forwardRef<
  HTMLDivElement,
  {
    type: "pages" | "projects";
    x: number;
    y: number;
    activeTab: string;
    onSelect: (id: string) => void;
    onClose: () => void;
  }
>(({ type, x, y, activeTab, onSelect, onClose }, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        resolvedRef.current &&
        !resolvedRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, resolvedRef]);

  const items =
    type === "pages"
      ? pageFiles.map((f) => ({
          id: f.id,
          name: f.name,
          extension: f.extension,
        }))
      : projects.map((p) => ({
          id: `project:${p.slug}`,
          name: `${p.slug}.py`,
          extension: "py",
        }));

  return (
    <div
      ref={resolvedRef}
      className="fixed w-52 rounded-sm border shadow-xl overflow-hidden z-9999"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--border-color)",
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="py-1 max-h-60 overflow-y-auto">
        {items.map((item) => {
          const isActive =
            activeTab === item.id ||
            (type === "projects" && activeTab === item.id);
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-left transition-colors cursor-pointer"
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
              <FileIcon extension={item.extension} size={14} />
              <span
                className="text-[12px] truncate"
                style={{
                  color: isActive
                    ? "var(--tab-active-fg)"
                    : "var(--sidebar-fg)",
                }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

BreadcrumbDropdown.displayName = "BreadcrumbDropdown";