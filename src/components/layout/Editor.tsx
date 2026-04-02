"use client";

import { useApp } from "@/context/AppContext";
import { useMobile } from "@/hooks/useMobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import Breadcrumb from "./Breadcrumb";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { ArrowUp } from "lucide-react";

const HomePage = lazy(() => import("@/components/pages/HomePage"));
const AboutPage = lazy(() => import("@/components/pages/AboutPage"));
const ProjectsPage = lazy(() => import("@/components/pages/ProjectsPage"));
const ExperiencePage = lazy(() => import("@/components/pages/ExperiencePage"));
const SkillsPage = lazy(() => import("@/components/pages/SkillsPage"));
const ContactPage = lazy(() => import("@/components/pages/ContactPage"));
const ProjectDetailPage = lazy(
  () => import("@/components/pages/ProjectDetailPage")
);
const ResumePage = lazy(
  () => import("@/components/pages/ResumePage")
);

const pageComponents: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  home: HomePage,
  about: AboutPage,
  projects: ProjectsPage,
  experience: ExperiencePage,
  skills: SkillsPage,
  contact: ContactPage,
  resume: ResumePage,
};

// Prefetch map for lazy-loaded pages
const prefetchMap: Record<string, () => void> = {
  home: () => import("@/components/pages/HomePage"),
  about: () => import("@/components/pages/AboutPage"),
  projects: () => import("@/components/pages/ProjectsPage"),
  experience: () => import("@/components/pages/ExperiencePage"),
  skills: () => import("@/components/pages/SkillsPage"),
  contact: () => import("@/components/pages/ContactPage"),
};

export function prefetchPage(tabId: string) {
  const fn = prefetchMap[tabId];
  if (fn) fn();
}

function PageSkeleton() {
  const lineWidths = ["60%", "75%", "40%", "85%", "55%", "70%", "30%", "90%", "45%", "65%"];
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2 mb-6">
        <div
          className="h-6 w-40 rounded-sm"
          style={{ backgroundColor: "var(--active-bg)" }}
        />
        <div
          className="h-0.5 w-12"
          style={{ backgroundColor: "var(--accent-color)", opacity: 0.3 }}
        />
      </div>

      {/* Code lines skeleton */}
      <div className="space-y-1.5">
        {lineWidths.map((w, i) => (
          <div key={i} className="flex items-center gap-4">
            <span
              className="w-6 text-right text-[11px] shrink-0"
              style={{ color: "var(--editor-line-number)", opacity: 0.3 }}
            >
              {i + 1}
            </span>
            <div
              className="h-3.5 rounded-sm"
              style={{
                backgroundColor: "var(--active-bg)",
                width: w,
              }}
            />
          </div>
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-sm"
            style={{ backgroundColor: "var(--active-bg)" }}
          />
        ))}
      </div>
    </div>
  );
}

function FadeIn({
  children,
  tabKey,
}: {
  children: React.ReactNode;
  tabKey: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.dataset.state = "entering";

    const raf = requestAnimationFrame(() => {
      el.dataset.state = "entered";
    });

    return () => cancelAnimationFrame(raf);
  }, [tabKey]);

  return (
    <div ref={containerRef} data-motion="page" data-state="entering">
      {children}
    </div>
  );
}

export default function Editor() {
  const { activeTab, openTabs, setActiveTab } = useApp();
  const isMobile = useMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const goToNextTab = useCallback(() => {
    if (!activeTab) return;
    const idx = openTabs.indexOf(activeTab);
    if (idx < openTabs.length - 1) setActiveTab(openTabs[idx + 1]);
  }, [activeTab, openTabs, setActiveTab]);

  const goToPrevTab = useCallback(() => {
    if (!activeTab) return;
    const idx = openTabs.indexOf(activeTab);
    if (idx > 0) setActiveTab(openTabs[idx - 1]);
  }, [activeTab, openTabs, setActiveTab]);

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNextTab,
    onSwipeRight: goToPrevTab,
    threshold: 60,
  });

  // Reset scroll to top when switching tabs + track scroll position
  useEffect(() => {
    if (!scrollAreaRef.current) return;
    const viewport = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (!viewport) return;

    viewport.scrollTop = 0;

    const handleScroll = () => {
      setShowScrollTop(viewport.scrollTop > 300);
    };

    // Reset on tab switch
    handleScroll();

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const scrollToTop = useCallback(() => {
    if (!scrollAreaRef.current) return;
    const viewport = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) viewport.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!activeTab) return null;

  const isProjectDetail = activeTab.startsWith("project:");
  const PageComponent = isProjectDetail ? null : pageComponents[activeTab];

  if (!isProjectDetail && !PageComponent) return null;

  return (
    <div
      id="main-content"
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{ backgroundColor: "var(--editor-bg)" }}
      {...(isMobile ? swipeHandlers : {})}
    >
      <Breadcrumb />
      <div ref={scrollAreaRef} className="flex-1 overflow-hidden min-w-0">
        <ScrollArea className="h-full [&>div]:overflow-x-hidden [&_[data-radix-scroll-area-content]]:!block [&_[data-radix-scroll-area-content]]:!w-full [&_[data-radix-scroll-area-content]]:!min-w-0">
          <div
            className={`mx-auto w-full h-full min-w-0 overflow-y-auto overflow-x-hidden ${
              isMobile
                ? "px-6 py-8 mobile-bottom-offset"
                : "px-8 md:px-12 lg:px-40 py-20"
            }`}
          >
            <FadeIn tabKey={activeTab}>
              <Suspense fallback={<PageSkeleton />}>
                {isProjectDetail ? (
                  <ProjectDetailPage
                    slug={activeTab.replace("project:", "")}
                  />
                ) : (
                  PageComponent && <PageComponent />
                )}
              </Suspense>
            </FadeIn>
          </div>

          {/* Footer */}
          <footer
            className={`text-center py-6 text-[11px] select-none ${
              isMobile ? "px-4 pb-24" : "px-10"
            }`}
            style={{ color: "var(--editor-line-number)" }}
          >
            <p>&copy; {new Date().getFullYear()} Mugni Hidayah. Built with Next.js &amp; passion.</p>
          </footer>
        </ScrollArea>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`ds-hover-lift absolute p-2 rounded-sm border shadow-lg transition-opacity hover:opacity-100 cursor-pointer z-10 ${
            isMobile ? "mobile-scrolltop-offset left-4" : "bottom-4 right-4"
          }`}
          style={{
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--border-color)",
            color: "var(--editor-fg)",
            opacity: 0.7,
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  );
}
