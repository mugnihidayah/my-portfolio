"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

interface LogLine {
  text: string;
  type: "info" | "success" | "accent" | "muted";
  delay: number;
}

const BOOT_LINES: LogLine[] = [
  { text: "> Initializing workspace...", type: "info", delay: 0 },
  { text: "> Loading profile: Mugni Hidayah", type: "accent", delay: 400 },
  { text: "> Role: AI Engineer | Data Scientist", type: "success", delay: 700 },
  { text: "> Mounting components...", type: "info", delay: 1000 },
  {
    text: "> Extensions: Python, TensorFlow, LangChain",
    type: "muted",
    delay: 1400,
  },
  { text: "> Building workspace index...", type: "info", delay: 1800 },
  { text: "> Ready.", type: "success", delay: 2300 },
];

const TOTAL_DURATION = 5000;
const FADE_DURATION = 600;

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "booting" | "fading" | "done">(
    "logo"
  );
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const skip = useCallback(() => {
    cleanup();
    setPhase("fading");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, FADE_DURATION);
  }, [cleanup, onComplete]);

  useEffect(() => {
    // Phase 1: Logo pulse (0-600ms)
    const logoTimer = setTimeout(() => {
      setPhase("booting");
    }, 600);
    timersRef.current.push(logoTimer);

    // Phase 2: Boot lines
    BOOT_LINES.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, 600 + line.delay);
      timersRef.current.push(timer);
    });

    // Progress bar animation
    const progressStart = 600;
    const progressEnd = 600 + TOTAL_DURATION - FADE_DURATION;
    const startTime = Date.now();

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressElapsed = Math.max(0, elapsed - progressStart);
      const progressDuration = progressEnd - progressStart;
      const pct = Math.min(progressElapsed / progressDuration, 1);
      // Ease out cubic for satisfying deceleration
      const eased = 1 - Math.pow(1 - pct, 3);
      setProgress(eased * 100);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(animateProgress);
      }
    };
    rafRef.current = requestAnimationFrame(animateProgress);

    // Phase 3: Fade out
    const fadeTimer = setTimeout(() => {
      setPhase("fading");
    }, 600 + TOTAL_DURATION - FADE_DURATION);
    timersRef.current.push(fadeTimer);

    // Done
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 600 + TOTAL_DURATION);
    timersRef.current.push(doneTimer);

    return cleanup;
  }, [cleanup, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`boot-sequence ${phase === "fading" ? "boot-sequence--fading" : ""}`}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0e0e0e",
      }}
    >
      {/* Scanline overlay */}
      <div className="boot-scanlines" />

      {/* Content */}
      <div className="boot-content">
        {/* Logo phase */}
        <div
          className={`boot-logo ${phase === "logo" ? "boot-logo--active" : "boot-logo--small"}`}
        >
          <div className="boot-logo-icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M12 28L8 20L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 12L32 20L28 28"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="22"
                y1="10"
                x2="18"
                y2="30"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="boot-logo-text">Mugni Hidayah</span>
        </div>

        {/* Terminal output */}
        {phase !== "logo" && (
          <div className="boot-terminal">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={`boot-line boot-line--${line.type}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {line.text}
                {i === visibleLines - 1 && i < BOOT_LINES.length - 1 && (
                  <span className="boot-cursor">▋</span>
                )}
              </div>
            ))}

            {/* Progress bar */}
            {visibleLines >= 4 && (
              <div className="boot-progress-container">
                <div className="boot-progress-track">
                  <div
                    className="boot-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="boot-progress-text">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skip button */}
      <button type="button" onClick={skip} className="boot-skip">
        Skip <span className="boot-skip-key">ESC</span>
      </button>

      {/* ESC key listener */}
      <EscListener onEsc={skip} />
    </div>
  );
}

function EscListener({ onEsc }: { onEsc: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEsc();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEsc]);
  return null;
}
