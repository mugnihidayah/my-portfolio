/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

const BootSequence = dynamic(
  () => import("@/components/layout/BootSequence"),
  { ssr: false }
);
import { useApp } from "@/context/AppContext";
import { useMobile } from "@/hooks/useMobile";
import { ChatProvider } from "@/context/ChatContext";
import { ToastProvider } from "@/context/ToastContext";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import ToastContainer from "@/components/layout/ToastContainer";
import TitleBar from "@/components/layout/TitleBar";
import ActivityBar from "@/components/layout/ActivityBar";
import Sidebar from "@/components/layout/Sidebar";
import TabBar from "@/components/layout/TabBar";
import Editor from "@/components/layout/Editor";
import Terminal from "@/components/layout/Terminal";
import StatusBar from "@/components/layout/StatusBar";
import CommandPalette from "@/components/layout/CommandPalette";
import MotionPresence from "@/components/layout/MotionPresence";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatBubble from "@/components/chat/ChatBubble";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Search, TerminalSquare } from "lucide-react";

export default function Home() {
  const {
    sidebarVisible,
    toggleSidebar,
    openTabs,
    terminalVisible,
    toggleTerminal,
    chatPanelVisible,
    commandPaletteOpen,
    setCommandPaletteOpen,
    openCommandPalette,
  } = useApp();

  const isMobile = useMobile();
  const [isBooted, setIsBooted] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileTerminalOpen, setMobileTerminalOpen] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleTerminal = useCallback(() => {
    if (isMobile) {
      setMobileTerminalOpen((prev) => !prev);
    } else {
      toggleTerminal();
    }
  }, [isMobile, toggleTerminal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        handleToggleTerminal();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        openCommandPalette();
      }
      if (e.ctrlKey && !e.shiftKey && e.key === "p") {
        e.preventDefault();
        openCommandPalette();
      }
      if (e.ctrlKey && (e.key === "b" || e.key === "B") && !e.shiftKey) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggleTerminal, openCommandPalette, toggleSidebar]);

  useEffect(() => {
    if (isMobile && terminalVisible) {
      setMobileTerminalOpen(true);
      toggleTerminal();
    }
  }, [isMobile, terminalVisible, toggleTerminal]);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      const clampedHeight = Math.min(
        Math.max(newHeight, 80),
        containerRect.height * 0.7
      );
      setTerminalHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const timeoutId = setTimeout(() => {
        setMobileSidebarOpen(false);
        setMobileTerminalOpen(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    if (commandPaletteOpen || chatPanelVisible || mobileTerminalOpen) {
      setMobileSidebarOpen(false);
    }
  }, [chatPanelVisible, commandPaletteOpen, isMobile, mobileTerminalOpen]);

  const hasOpenTabs = openTabs.length > 0;
  const sidebarMotionStyle = {
    "--motion-panel-size": "240px",
  } as React.CSSProperties;
  const terminalMotionStyle = {
    "--motion-panel-size": `${terminalHeight}px`,
  } as React.CSSProperties;
  const chatMotionStyle = {
    "--motion-panel-size": "288px",
  } as React.CSSProperties;

  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <ChatProvider>
        <ToastProvider>
          <ErrorBoundary>
            {!isBooted && <BootSequence onComplete={() => setIsBooted(true)} />}
            <div 
              className={`h-screen w-screen flex flex-col overflow-hidden transition-all duration-300 ease-out ${isBooted ? "ide-reveal" : ""}`} 
              style={!isBooted ? { visibility: "hidden" } : undefined}
              data-command-palette-open={commandPaletteOpen}
            >
              <TitleBar
                onOpenCommandPalette={openCommandPalette}
                isMobile={isMobile}
                onOpenSidebar={() => setMobileSidebarOpen(true)}
                onOpenTerminal={() => setMobileTerminalOpen(true)}
              />

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {hasOpenTabs ? (
                  <>
                    <TabBar isMobile={isMobile} />
                    <ErrorBoundary>
                      <Editor />
                    </ErrorBoundary>
                  </>
                ) : (
                  <WelcomeScreen
                    onOpenCommandPalette={openCommandPalette}
                    isMobile={isMobile}
                  />
                )}
              </div>

              <ActivityBar
                isMobile={isMobile}
                onOpenSidebar={() => setMobileSidebarOpen(true)}
              />
              <StatusBar isMobile={isMobile} />

              <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                <SheetContent
                  side="left"
                  className="w-70 p-0 flex flex-col [&>button]:hidden"
                  style={{
                    backgroundColor: "var(--sidebar-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Sidebar Navigation</SheetTitle>
                  </SheetHeader>
                  <Sidebar
                    isMobile={isMobile}
                    onFileSelect={() => setMobileSidebarOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              <Sheet open={mobileTerminalOpen} onOpenChange={setMobileTerminalOpen}>
                <SheetContent
                  side="bottom"
                  className="h-[60vh] p-0 rounded-t-xl flex flex-col [&>button]:hidden"
                  style={{
                    backgroundColor: "var(--panel-bg)",
                    borderColor: "var(--panel-border)",
                  }}
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Terminal</SheetTitle>
                  </SheetHeader>
                  <Terminal
                    isMobile={isMobile}
                    onClose={() => setMobileTerminalOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              <CommandPalette
                open={commandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
              />
              <ChatBubble />
              <ToastContainer />
            </div>
          </ErrorBoundary>
        </ToastProvider>
      </ChatProvider>
    );
  }

  // DESKTOP LAYOUT
  return (
    <ChatProvider>
      <ToastProvider>
        <ErrorBoundary>
          {!isBooted && <BootSequence onComplete={() => setIsBooted(true)} />}
          <div 
            className={`h-screen w-screen flex flex-col overflow-hidden transition-all duration-300 ease-out ${isBooted ? "ide-reveal" : ""}`} 
            style={!isBooted ? { visibility: "hidden" } : undefined}
            data-command-palette-open={commandPaletteOpen}
          >
            <TitleBar
              onOpenCommandPalette={openCommandPalette}
              isMobile={false}
            />

            <div className="flex-1 flex overflow-hidden">
              <ActivityBar isMobile={false} />
              <MotionPresence
                show={sidebarVisible}
                variant="panel-left"
                className="h-full shrink-0"
                style={sidebarMotionStyle}
              >
                <Sidebar isMobile={false} />
              </MotionPresence>

              <div ref={containerRef} className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 flex flex-col min-h-0">
                  {hasOpenTabs ? (
                    <>
                      <TabBar isMobile={false} />
                      <ErrorBoundary>
                        <Editor />
                      </ErrorBoundary>
                    </>
                  ) : (
                    <WelcomeScreen
                      onOpenCommandPalette={openCommandPalette}
                      isMobile={false}
                    />
                  )}
                </div>

                <MotionPresence
                  show={terminalVisible}
                  variant="panel-bottom"
                  className="shrink-0"
                  style={terminalMotionStyle}
                >
                  <div className="flex h-full flex-col">
                    <div
                      onMouseDown={handleMouseDown}
                      className="h-0.75 shrink-0 cursor-ns-resize hover:bg-(--accent-color) active:bg-(--accent-color) transition-colors"
                      style={{ backgroundColor: "var(--panel-border)" }}
                    />
                    <div className="shrink-0" style={{ height: terminalHeight }}>
                      <Terminal isMobile={false} />
                    </div>
                  </div>
                </MotionPresence>
              </div>

              <MotionPresence
                show={chatPanelVisible}
                variant="panel-right"
                className="h-full shrink-0"
                style={chatMotionStyle}
              >
                <div
                  className="h-full w-72 flex flex-col shrink-0 border-l overflow-hidden"
                  style={{
                    backgroundColor: "var(--sidebar-bg)",
                    borderColor: "var(--border-color)",
                    minWidth: "288px",
                    maxWidth: "288px",
                  }}
                >
                  <ChatSidebar />
                </div>
              </MotionPresence>
            </div>

            <StatusBar isMobile={false} />
          </div>

          <CommandPalette
            open={commandPaletteOpen}
            onOpenChange={setCommandPaletteOpen}
          />
          <ChatBubble />
          <ToastContainer />
        </ErrorBoundary>
      </ToastProvider>
    </ChatProvider>
  );
}

function WelcomeScreen({
  onOpenCommandPalette,
  isMobile = false,
}: {
  onOpenCommandPalette: () => void;
  isMobile?: boolean;
}) {
  const { toggleTerminal } = useApp();

  return (
    <div
      className="flex-1 flex items-center justify-center select-none px-4"
      style={{ backgroundColor: "var(--editor-bg)" }}
    >
      <div className="text-center space-y-3 max-w-sm">
        <h1
          className={`font-bold opacity-20 ${isMobile ? "text-3xl" : "text-5xl"}`}
        >
          Mugni Hidayah
        </h1>
        <p className={`opacity-15 ${isMobile ? "text-base" : "text-lg"}`}>
          AI Engineer
        </p>
        <div className="pt-6 space-y-2 text-sm opacity-15">
          <p>
            {isMobile
              ? "Tap the menu to get started"
              : "Open a file from the Explorer to get started"}
          </p>
          {isMobile && (
            <div className="flex flex-wrap justify-center gap-2 pt-2 opacity-100">
              <button
                onClick={onOpenCommandPalette}
                className="ds-btn ds-btn-secondary px-3 py-2 text-[12px]"
              >
                <Search size={13} />
                Search
              </button>
              <button
                onClick={toggleTerminal}
                className="ds-btn ds-btn-secondary px-3 py-2 text-[12px]"
              >
                <TerminalSquare size={13} />
                Terminal
              </button>
            </div>
          )}
          {!isMobile && (
            <>
              <button
                onClick={onOpenCommandPalette}
                className="text-xs hover:opacity-100 transition-opacity block mx-auto"
              >
                Press{" "}
                <kbd className="ds-kbd">
                  Ctrl+Shift+P
                </kbd>{" "}
                for commands
              </button>
              <button
                onClick={toggleTerminal}
                className="text-xs hover:opacity-100 transition-opacity block mx-auto"
              >
                Press{" "}
                <kbd className="ds-kbd">
                  Ctrl+`
                </kbd>{" "}
                to open terminal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
