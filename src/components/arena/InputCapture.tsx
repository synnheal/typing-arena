"use client";

import { useRef, useEffect } from "react";
import { useTestStore } from "@/stores/test-store";
import { useTypingCapture } from "@/hooks/useTypingCapture";

export function InputCapture() {
  const inputRef = useRef<HTMLInputElement>(null);
  const status = useTestStore((s) => s.status);
  const { handleKeyDown } = useTypingCapture();

  // Auto-focus on mount and after reset
  useEffect(() => {
    if (status !== "finished") {
      inputRef.current?.focus();
    }
  }, [status]);

  return (
    <>
      {/* Clickable overlay covering the text display area */}
      <div
        className="absolute inset-0 z-10 cursor-text"
        onClick={() => inputRef.current?.focus()}
      />
      {/* Input positioned offscreen but with real dimensions so it receives key events */}
      <input
        ref={inputRef}
        type="text"
        className="fixed -left-[9999px] top-0 w-px h-px opacity-0"
        onKeyDown={handleKeyDown}
        onChange={() => {}} // prevent React warning
        value="" // keep input empty to avoid IME issues
        onBlur={() => {
          if (status === "running" || status === "idle") {
            setTimeout(() => inputRef.current?.focus(), 10);
          }
        }}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Typing input"
      />
    </>
  );
}
