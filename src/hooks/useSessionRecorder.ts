"use client";

import { useEffect, useRef } from "react";
import { useTestStore } from "@/stores/test-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";
import { calculateScore } from "@/lib/engine/scorer";
import { saveSession } from "@/lib/storage/sessions";
import { updateDailyAggregate } from "@/lib/storage/aggregates";
import type { Session } from "@/types/test";
import { v4 as uuid } from "uuid";

export function useSessionRecorder() {
  const status = useTestStore((s) => s.status);
  const keystrokes = useTestStore((s) => s.keystrokes);
  const targetText = useTestStore((s) => s.targetText);
  const startTime = useTestStore((s) => s.startTime);
  const duration = useTestStore((s) => s.duration);
  const mode = useSettingsStore((s) => s.mode);
  const language = useSettingsStore((s) => s.language);
  const addSession = useStatsStore((s) => s.addSession);
  const savedRef = useRef(false);

  useEffect(() => {
    if (status !== "finished" || savedRef.current) return;
    if (keystrokes.length === 0) return;

    savedRef.current = true;

    const score = calculateScore(keystrokes, duration);
    const session: Session = {
      id: uuid(),
      createdAt: startTime || Date.now(),
      duration,
      mode,
      language,
      targetText,
      keystrokes,
      ...score,
    };

    saveSession(session);
    updateDailyAggregate(session);
    addSession(session);
  }, [status, keystrokes, targetText, startTime, duration, mode, language, addSession]);

  // Reset saved flag when test resets
  useEffect(() => {
    if (status === "idle") {
      savedRef.current = false;
    }
  }, [status]);
}
