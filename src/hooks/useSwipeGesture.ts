import { useRef, useCallback } from "react";

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  maxVerticalDistance?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  maxVerticalDistance = 80,
}: UseSwipeOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const distX = touchStart.current.x - touchEnd.current.x;
    const distY = Math.abs(touchStart.current.y - touchEnd.current.y);

    // Ignore if mostly vertical scroll
    if (distY > maxVerticalDistance) return;

    if (Math.abs(distX) > threshold) {
      if (distX > 0) {
        // Swiped left -> next tab
        onSwipeLeft?.();
      } else {
        // Swiped right -> previous tab
        onSwipeRight?.();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold, maxVerticalDistance]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}
