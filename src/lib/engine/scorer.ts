import type { Keystroke } from "@/types/test";

export interface ScoreResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  backspaces: number;
}

export function calculateScore(
  keystrokes: Keystroke[],
  durationSeconds: number
): ScoreResult {
  if (keystrokes.length === 0 || durationSeconds <= 0) {
    return { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0, correctChars: 0, incorrectChars: 0, backspaces: 0 };
  }

  const minutes = durationSeconds / 60;
  const backspaces = keystrokes.filter((k) => k.typedChar === "Backspace").length;
  const typed = keystrokes.filter((k) => k.typedChar !== "Backspace");
  const correctChars = typed.filter((k) => k.correct).length;
  const incorrectChars = typed.filter((k) => !k.correct).length;

  const wpm = Math.round((correctChars / 5) / minutes);
  const rawWpm = Math.round((typed.length / 5) / minutes);
  const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 0;

  // Consistency: inverse of WPM variance over 1-second intervals
  const consistency = calculateConsistency(keystrokes, durationSeconds);

  return { wpm, rawWpm, accuracy, consistency, correctChars, incorrectChars, backspaces };
}

function calculateConsistency(keystrokes: Keystroke[], durationSeconds: number): number {
  if (keystrokes.length < 10) return 100;

  const intervalMs = 1000;
  const intervals: number[] = [];
  const startTime = keystrokes[0].t;

  for (let i = 0; i < durationSeconds; i++) {
    const from = startTime + i * intervalMs;
    const to = from + intervalMs;
    const charsInInterval = keystrokes.filter(
      (k) => k.t >= from && k.t < to && k.correct && k.typedChar !== "Backspace"
    ).length;
    const wpmInterval = (charsInInterval / 5) * 60;
    intervals.push(wpmInterval);
  }

  if (intervals.length < 2) return 100;

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (mean === 0) return 100;

  const variance = intervals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / intervals.length;
  const cv = Math.sqrt(variance) / mean; // coefficient of variation

  // Map CV to 0-100 scale (lower CV = higher consistency)
  return Math.round(Math.max(0, Math.min(100, (1 - cv) * 100)));
}
