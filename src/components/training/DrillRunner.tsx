"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Drill } from "@/types/training";
import type { Keystroke } from "@/types/test";
import { calculateScore } from "@/lib/engine/scorer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DrillRunnerProps {
  drill: Drill;
  onComplete: () => void;
}

export function DrillRunner({ drill, onComplete }: DrillRunnerProps) {
  const t = useTranslations("training");
  const [position, setPosition] = useState(0);
  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const typedMap = useRef(new Map<number, boolean>());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (finished) return;
      if (e.key === " " || e.key === "Backspace") e.preventDefault();
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta" || e.key === "Dead" || e.key === "Tab") return;

      const now = Date.now();
      const lastTime = keystrokes.length > 0 ? keystrokes[keystrokes.length - 1].t : now;
      const latencyMs = keystrokes.length > 0 ? now - lastTime : 0;

      if (e.key === "Backspace") {
        if (position > 0) {
          typedMap.current.delete(position - 1);
          setPosition((p) => Math.max(0, p - 1));
          setKeystrokes((ks) => [...ks, { t: now, expectedChar: drill.text[position - 1], typedChar: "Backspace", correct: false, keyCode: e.code, latencyMs }]);
        }
        return;
      }

      if (e.key.length === 1 && position < drill.text.length) {
        const expected = drill.text[position];
        const correct = e.key === expected;
        typedMap.current.set(position, correct);
        setKeystrokes((ks) => [...ks, { t: now, expectedChar: expected, typedChar: e.key, correct, keyCode: e.code, latencyMs }]);
        setPosition((p) => p + 1);

        if (position + 1 >= drill.text.length) {
          setFinished(true);
        }
      }
    },
    [position, keystrokes, drill.text, finished]
  );

  const elapsed = finished && keystrokes.length > 0
    ? (keystrokes[keystrokes.length - 1].t - keystrokes[0].t) / 1000
    : 0;
  const score = finished ? calculateScore(keystrokes, Math.max(1, elapsed)) : null;
  const pct = drill.text.length > 0 ? (position / drill.text.length) * 100 : 0;

  if (finished && score) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4 text-center">
          <h3 className="text-xl font-bold">{t("drillComplete")}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{score.wpm}</div>
              <div className="text-xs text-muted-foreground">WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{score.accuracy}%</div>
              <div className="text-xs text-muted-foreground">{t("mastery")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{Math.round(elapsed)}s</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>
          <Button onClick={onComplete}>{t("startDrill")}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Progress value={pct} className="h-2" />
      <div className="relative rounded-lg border bg-card p-4 font-mono text-base leading-relaxed tracking-wide select-none max-h-[160px] overflow-y-auto">
        {drill.text.split("").map((char, i) => {
          const isTyped = typedMap.current.has(i);
          const isCorrect = typedMap.current.get(i);
          const isCurrent = i === position;

          return (
            <span
              key={i}
              className={cn(
                isTyped && isCorrect && "text-primary",
                isTyped && !isCorrect && "text-destructive bg-destructive/10",
                !isTyped && "text-muted-foreground/50",
                isCurrent && "border-l-2 border-primary -ml-px pl-px"
              )}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => inputRef.current?.focus(), 10)}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
