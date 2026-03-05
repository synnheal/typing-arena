"use client";

import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

const LINE_HEIGHT_PX = 40; // matches leading-10
const VISIBLE_LINES = 2;

export function TextDisplay() {
  const targetText = useTestStore((s) => s.targetText);
  const position = useTestStore((s) => s.position);
  const status = useTestStore((s) => s.status);
  const currentError = useTestStore((s) => s.currentError);
  const caretRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    if (!caretRef.current || !contentRef.current) return;
    // offsetTop is unaffected by CSS transforms, so no circular dependency
    const caretTop = caretRef.current.offsetTop - contentRef.current.offsetTop;
    const caretLine = Math.floor(caretTop / LINE_HEIGHT_PX);
    // Keep caret on the first visible line
    const newOffset = Math.max(0, caretLine * LINE_HEIGHT_PX);
    setScrollOffset((prev) => (prev !== newOffset ? newOffset : prev));
  }, [position, currentError]);

  useEffect(() => {
    if (status === "idle") setScrollOffset(0);
  }, [status]);

  return (
    <div className="relative rounded-lg border bg-card select-none py-5">
      {/* Viewport: exactly 2 lines, no vertical padding */}
      <div
        className="overflow-hidden px-6"
        style={{ height: `${LINE_HEIGHT_PX * VISIBLE_LINES}px` }}
      >
        <div
          ref={contentRef}
          className="font-mono text-xl leading-10 tracking-wide break-words transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${scrollOffset}px)` }}
        >
          {targetText.split("").map((char, i) => {
            const isTyped = i < position;
            const isError = i === position && currentError !== null;
            const isCaret = i === position && currentError === null;

            return (
              <span
                key={i}
                ref={i === position ? caretRef : undefined}
                className={cn(
                  isTyped && "text-primary",
                  isError && "text-destructive bg-destructive/20 rounded-sm",
                  isCaret && status !== "finished" && "border-l-2 border-primary -ml-px pl-px",
                  !isTyped && !isError && !isCaret && "text-muted-foreground"
                )}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Overlay for idle state */}
      {status === "idle" && targetText.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg">
          <span className="text-muted-foreground text-base font-sans animate-pulse">
            Start typing...
          </span>
        </div>
      )}
    </div>
  );
}
