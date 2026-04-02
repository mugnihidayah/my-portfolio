"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { files } from "@/data/files";
import { themes } from "@/themes";
import FileIcon from "./FileIcon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Terminal,
  Bot,
  Download,
  Sun,
  Moon,
  Check,
  Sparkles,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const { openFile, toggleTerminal, openChatPanel } = useApp();
  const { currentTheme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  // Reset search when opened
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setSearch(""), 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const runCommand = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--border-color)",
          color: "var(--editor-fg)",
        }}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
          className="text-[13px]"
          style={{
            color: "var(--editor-fg)",
          }}
        />
        <CommandList
          className="max-h-87.5"
          style={{
            color: "var(--editor-fg)",
          }}
        >
          <CommandEmpty
            className="px-4 py-6"
          >
            <div className="ds-empty-state">
              <div className="ds-empty-icon">
                <Sparkles size={16} />
              </div>
              <div className="space-y-1">
                <p className="ds-empty-title">No matching command</p>
                <p className="ds-empty-copy">
                  Try a file name, theme, terminal, resume, or AI chat.
                </p>
              </div>
            </div>
          </CommandEmpty>

          {/* Files */}
          <CommandGroup
            heading="Files"
            className="text-[11px] uppercase tracking-wider"
            style={{ color: "var(--sidebar-header-fg)" }}
          >
            {files.map((file) => (
              <CommandItem
                key={file.id}
                value={`open ${file.name}`}
                onSelect={() =>
                  runCommand(() => openFile(file.id))
                }
                className="flex items-center gap-2 px-3 py-1.5 text-[13px] cursor-pointer"
                style={{ color: "var(--editor-fg)" }}
              >
                <FileIcon extension={file.extension} size={14} />
                <span className="flex-1">{file.name}</span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--editor-fg)", opacity: 0.3 }}
                >
                  {file.language}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator style={{ backgroundColor: "var(--border-color)" }} />

          {/* Actions */}
          <CommandGroup
            heading="Actions"
            className="text-[11px] uppercase tracking-wider"
            style={{ color: "var(--sidebar-header-fg)" }}
          >
            <CommandItem
              value="toggle terminal"
              onSelect={() => runCommand(() => toggleTerminal())}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] cursor-pointer"
              style={{ color: "var(--editor-fg)" }}
            >
              <Terminal size={14} style={{ color: "var(--accent-color)" }} />
              <span className="flex-1">Toggle Terminal</span>
                <kbd className="ds-kbd opacity-60">
                  Ctrl+`
                </kbd>
            </CommandItem>

            <CommandItem
              value="toggle ai chat"
              onSelect={() => runCommand(() => openChatPanel())}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] cursor-pointer"
              style={{ color: "var(--editor-fg)" }}
            >
              <Bot size={14} style={{ color: "var(--accent-color)" }} />
              <span>Open AI Chat</span>
            </CommandItem>

            <CommandItem
              value="download resume cv"
              onSelect={() =>
                runCommand(() => {
                  const link = document.createElement("a");
                  link.href = "/resume.pdf";
                  link.download = "Mugni_Hidayah_Resume.pdf";
                  link.click();
                })
              }
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] cursor-pointer"
              style={{ color: "var(--editor-fg)" }}
            >
              <Download size={14} style={{ color: "var(--accent-color)" }} />
              <span>Download Resume</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator style={{ backgroundColor: "var(--border-color)" }} />

          {/* Themes */}
          <CommandGroup
            heading="Color Theme"
            className="text-[11px] uppercase tracking-wider"
            style={{ color: "var(--sidebar-header-fg)" }}
          >
            {themes.map((theme) => {
              const isActive = currentTheme.id === theme.id;
              const ThemeIcon = theme.type === "light" ? Sun : Moon;

              return (
                <CommandItem
                  key={theme.id}
                  value={`theme ${theme.name} ${theme.id}`}
                  onSelect={() =>
                    runCommand(() => setTheme(theme.id))
                  }
                  className="flex items-center gap-2 px-3 py-1.5 text-[13px] cursor-pointer"
                  style={{ color: "var(--editor-fg)" }}
                >
                  <ThemeIcon size={14} style={{ color: "var(--accent-color)" }} />
                  <div className="flex items-center gap-2 flex-1">
                    {/* Color Preview */}
                    <div className="flex gap-0.5 shrink-0">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: theme.colors["--editor-bg"],
                          border: "1px solid var(--border-color)",
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: theme.colors["--accent-color"],
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: theme.colors["--statusbar-bg"],
                        }}
                      />
                    </div>
                    <span>{theme.name}</span>
                  </div>
                  {isActive && (
                    <Check
                      size={12}
                      className="shrink-0"
                      style={{ color: "var(--accent-color)" }}
                    />
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  );
}
