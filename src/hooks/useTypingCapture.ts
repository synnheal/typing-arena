"use client";

import { useCallback } from "react";
import { useTestStore } from "@/stores/test-store";
import type { Keystroke } from "@/types/test";

export function useTypingCapture() {
  const {
    targetText,
    position,
    status,
    keystrokes,
    currentError,
    start,
    addKeystroke,
    advancePosition,
    setCurrentError,
    finish,
  } = useTestStore();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (status === "finished") return;

      // Prevent browser defaults for Space and Backspace
      if (e.key === " " || e.key === "Backspace") {
        e.preventDefault();
      }

      // Ignore modifier-only keys, Dead keys (IME), and function keys
      if (
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta" ||
        e.key === "CapsLock" ||
        e.key === "Dead" ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "Enter" ||
        (e.key.startsWith("F") && e.key.length > 1)
      ) {
        return;
      }

      const now = Date.now();
      const lastTime =
        keystrokes.length > 0 ? keystrokes[keystrokes.length - 1].t : now;
      const latencyMs = keystrokes.length > 0 ? now - lastTime : 0;

      // If blocked on an error, only allow Backspace to clear it
      if (currentError !== null) {
        if (e.key === "Backspace") {
          addKeystroke({
            t: now,
            expectedChar: targetText[position] || "",
            typedChar: "Backspace",
            correct: false,
            keyCode: e.code,
            latencyMs,
          });
          setCurrentError(null);
        }
        return;
      }

      // Backspace when no error: go back one position
      if (e.key === "Backspace") {
        // Don't allow backspace when no error (all previous chars are correct)
        return;
      }

      // Start on first real keypress
      if (status === "idle") {
        start();
      }

      // Regular character
      if (e.key.length === 1 && position < targetText.length) {
        const expected = targetText[position];
        const typed = e.key;
        const correct = typed === expected;

        const ks: Keystroke = {
          t: now,
          expectedChar: expected,
          typedChar: typed,
          correct,
          keyCode: e.code,
          latencyMs,
        };

        addKeystroke(ks);

        if (correct) {
          advancePosition();

          // Check if test is complete
          if (position + 1 >= targetText.length) {
            finish();
          }
        } else {
          // Block: set error, don't advance
          setCurrentError(typed);
        }
      }
    },
    [status, position, targetText, keystrokes, currentError, start, addKeystroke, advancePosition, setCurrentError, finish]
  );

  return { handleKeyDown };
}
