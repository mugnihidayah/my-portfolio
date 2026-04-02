"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMobile(breakpoint = 1024) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("resize", onStoreChange);
    return () => window.removeEventListener("resize", onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => {
    return window.innerWidth < breakpoint;
  }, [breakpoint]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}