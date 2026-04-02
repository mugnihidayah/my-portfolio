"use client";

import { useState, useEffect, useRef } from "react";

interface UseTypingAnimationOptions {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterTyping?: number;
  pauseAfterDeleting?: number;
}

export function useTypingAnimation({
  texts,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseAfterTyping = 2000,
  pauseAfterDeleting = 500,
}: UseTypingAnimationOptions) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const phaseRef = useRef<"typing" | "pausing" | "deleting" | "waiting">(
    "typing"
  );

  useEffect(() => {
    if (texts.length === 0) return;

    const tick = () => {
      const currentText = texts[indexRef.current];

      switch (phaseRef.current) {
        case "typing":
          if (charRef.current < currentText.length) {
            charRef.current++;
            setDisplayText(currentText.slice(0, charRef.current));
            setIsTyping(true);
            return typingSpeed;
          } else {
            phaseRef.current = "pausing";
            setIsTyping(false);
            return pauseAfterTyping;
          }

        case "pausing":
          phaseRef.current = "deleting";
          setIsTyping(true);
          return deletingSpeed;

        case "deleting":
          if (charRef.current > 0) {
            charRef.current--;
            setDisplayText(currentText.slice(0, charRef.current));
            return deletingSpeed;
          } else {
            phaseRef.current = "waiting";
            return pauseAfterDeleting;
          }

        case "waiting":
          indexRef.current = (indexRef.current + 1) % texts.length;
          phaseRef.current = "typing";
          return typingSpeed;
      }
    };

    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = tick();
      timeoutId = setTimeout(schedule, delay);
    };

    schedule();
    return () => clearTimeout(timeoutId);
  }, [texts, typingSpeed, deletingSpeed, pauseAfterTyping, pauseAfterDeleting]);

  return { displayText, isTyping };
}
