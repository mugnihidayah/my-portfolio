"use client";

import { useEffect, useState } from "react";

type MotionVariant =
  | "panel-left"
  | "panel-right"
  | "panel-bottom"
  | "popover"
  | "toast";

interface MotionPresenceProps {
  show: boolean;
  children: React.ReactNode;
  variant: MotionVariant;
  className?: string;
  style?: React.CSSProperties;
  durationMs?: number;
}

export default function MotionPresence({
  show,
  children,
  variant,
  className = "",
  style,
  durationMs = 240,
}: MotionPresenceProps) {
  const [mounted, setMounted] = useState(show);
  const shouldRender = show || mounted;

  useEffect(() => {
    if (show) {
      const rafId = window.requestAnimationFrame(() => {
        setMounted(true);
      });

      return () => window.cancelAnimationFrame(rafId);
    }

    const timeoutId = window.setTimeout(() => {
      setMounted(false);
    }, durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [show, durationMs]);

  if (!shouldRender) return null;

  return (
    <div
      data-motion={variant}
      data-state={show ? "open" : "closed"}
      className={className}
      style={{
        pointerEvents: show ? "auto" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
