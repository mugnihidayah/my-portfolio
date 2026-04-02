"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { resolveTabFile } from "@/data/files";

export type SidebarPanel = "explorer" | "search" | "extensions" | "settings";

interface AppContextType {
  sidebarVisible: boolean;
  activeSidebarPanel: SidebarPanel;
  toggleSidebar: () => void;
  setSidebarPanel: (panel: SidebarPanel) => void;

  chatPanelVisible: boolean;
  openChatPanel: () => void;
  closeChatPanel: () => void;
  toggleChatPanel: () => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  sectionFocusRequest: {
    sectionId: string | null;
    nonce: number;
  };
  clearSectionFocus: () => void;

  openTabs: string[];
  activeTab: string | null;
  openFile: (fileId: string, options?: { sectionId?: string | null }) => void;
  closeTab: (fileId: string) => void;
  closeOtherTabs: (fileId: string) => void;
  closeAllTabs: () => void;
  closeTabsToRight: (fileId: string) => void;
  setActiveTab: (fileId: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;

  terminalVisible: boolean;
  toggleTerminal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const pageTitles: Record<string, string> = {
  home: "Home",
  about: "About",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  contact: "Contact",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeSidebarPanel, setActiveSidebarPanel] =
    useState<SidebarPanel>("explorer");
  const [chatPanelVisible, setChatPanelVisible] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sectionFocusRequest, setSectionFocusRequest] = useState({
    sectionId: null as string | null,
    nonce: 0,
  });
  const [openTabs, setOpenTabs] = useState<string[]>(["home"]);
  const [activeTab, setActiveTabState] = useState<string | null>("home");
  const [terminalVisible, setTerminalVisible] = useState(false);

  // Dynamic document title
  useEffect(() => {
    if (!activeTab) {
      document.title = "Mugni Hidayah | AI Engineer";
      return;
    }

    const file = resolveTabFile(activeTab);
    if (!file) {
      document.title = "Mugni Hidayah | AI Engineer";
      return;
    }

    // Project detail: "LLM Chatbot System | Projects | Mugni Hidayah"
    if (activeTab.startsWith("project:")) {
      const projectName = file.name.replace(".py", "");
      document.title = `${projectName} | Projects | Mugni Hidayah`;
      return;
    }

    // Static pages: "Projects | Mugni Hidayah"
    const pageTitle = pageTitles[activeTab] || file.name;
    document.title = `${pageTitle} | Mugni Hidayah`;
  }, [activeTab]);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  const setSidebarPanel = useCallback(
    (panel: SidebarPanel) => {
      if (activeSidebarPanel === panel && sidebarVisible) {
        setSidebarVisible(false);
      } else {
        setActiveSidebarPanel(panel);
        setSidebarVisible(true);
      }
    },
    [activeSidebarPanel, sidebarVisible]
  );

  const toggleChatPanel = useCallback(() => {
    setChatPanelVisible((prev) => !prev);
  }, []);

  const openChatPanel = useCallback(() => {
    setChatPanelVisible(true);
  }, []);

  const closeChatPanel = useCallback(() => {
    setChatPanelVisible(false);
  }, []);

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, []);

  const clearSectionFocus = useCallback(() => {
    setSectionFocusRequest((prev) => ({
      sectionId: null,
      nonce: prev.nonce + 1,
    }));
  }, []);

  const openFile = useCallback(
    (fileId: string, options?: { sectionId?: string | null }) => {
      setOpenTabs((prev) => {
        if (!prev.includes(fileId)) return [...prev, fileId];
        return prev;
      });
      setActiveTabState(fileId);
      setSectionFocusRequest((prev) => ({
        sectionId: options?.sectionId ?? null,
        nonce: prev.nonce + 1,
      }));
    },
    []
  );

  const closeTab = useCallback((fileId: string) => {
    setOpenTabs((prev) => {
      const newTabs = prev.filter((id) => id !== fileId);
      setActiveTabState((currentActive) => {
        if (currentActive === fileId) {
          return newTabs.length > 0 ? newTabs[newTabs.length - 1] : null;
        }
        return currentActive;
      });
      return newTabs;
    });
  }, []);

  const closeOtherTabs = useCallback((fileId: string) => {
    setOpenTabs([fileId]);
    setActiveTabState(fileId);
  }, []);

  const closeAllTabs = useCallback(() => {
    setOpenTabs([]);
    setActiveTabState(null);
  }, []);

  const closeTabsToRight = useCallback((fileId: string) => {
    setOpenTabs((prev) => {
      const index = prev.indexOf(fileId);
      if (index === -1) return prev;
      const newTabs = prev.slice(0, index + 1);
      setActiveTabState((currentActive) => {
        if (currentActive && !newTabs.includes(currentActive)) {
          return fileId;
        }
        return currentActive;
      });
      return newTabs;
    });
  }, []);

  const setActiveTab = useCallback((fileId: string) => {
    setActiveTabState(fileId);
    setSectionFocusRequest((prev) => ({
      sectionId: null,
      nonce: prev.nonce + 1,
    }));
  }, []);

  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setOpenTabs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const toggleTerminal = useCallback(() => {
    setTerminalVisible((prev) => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarVisible,
        activeSidebarPanel,
        toggleSidebar,
        setSidebarPanel,
        chatPanelVisible,
        openChatPanel,
        closeChatPanel,
        toggleChatPanel,
        commandPaletteOpen,
        setCommandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        sectionFocusRequest,
        clearSectionFocus,
        openTabs,
        activeTab,
        openFile,
        closeTab,
        closeOtherTabs,
        closeAllTabs,
        closeTabsToRight,
        setActiveTab,
        reorderTabs,
        terminalVisible,
        toggleTerminal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
