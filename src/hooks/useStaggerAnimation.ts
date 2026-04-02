"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export interface StaggerOptions {
  /** CSS selector untuk elemen yang dianimasikan. Default: "[data-animate]" */
  selector?: string;
  /** Offset vertikal dalam pixel. Default: 20 */
  y?: number;
  /** Offset horizontal dalam pixel. Default: 0 */
  x?: number;
  /** Durasi animasi dalam detik. Default: 0.5 */
  duration?: number;
  /** Delay antar elemen dalam detik. Default: 0.08 */
  stagger?: number;
  /** GSAP easing. Default: "power2.out" */
  ease?: string;
  /** Delay awal sebelum animasi mulai. Default: 0 */
  delay?: number;
  /** Dependencies untuk re-trigger animasi. Default: [] */
  dependencies?: React.DependencyList;
}

export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  options: StaggerOptions = {}
) {
  const containerRef = useRef<T>(null);

  const {
    selector = "[data-animate]",
    y = 30,
    x = 0,
    duration = 0.6,
    stagger = 0.08,
    ease = "back.out(1.2)",
    delay = 0,
    dependencies = [],
  } = options;

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const elements = containerRef.current.querySelectorAll(selector);
      if (elements.length === 0) return;

      gsap.fromTo(
        elements,
        { opacity: 0, y, x },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          stagger,
          ease,
          delay,
          overwrite: true,
        }
      );
    },
    { scope: containerRef, dependencies: dependencies as unknown[] }
  );

  return containerRef;
}