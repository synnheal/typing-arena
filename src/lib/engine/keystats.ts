import type { Keystroke, LetterStats, ConfusionPair } from "@/types/test";

export function computeLetterStats(keystrokes: Keystroke[]): LetterStats[] {
  const map = new Map<string, { correct: number; errors: number; latencies: number[] }>();

  for (const k of keystrokes) {
    if (k.typedChar === "Backspace" || k.expectedChar === " ") continue;
    const letter = k.expectedChar.toLowerCase();
    if (!/^[a-z]$/.test(letter)) continue;

    const entry = map.get(letter) || { correct: 0, errors: 0, latencies: [] };
    if (k.correct) {
      entry.correct++;
    } else {
      entry.errors++;
    }
    if (k.latencyMs > 0) {
      entry.latencies.push(k.latencyMs);
    }
    map.set(letter, entry);
  }

  const results: LetterStats[] = [];
  for (const [letter, data] of map) {
    const total = data.correct + data.errors;
    const avgLatency = data.latencies.length > 0
      ? data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length
      : 0;

    results.push({
      letter,
      totalTyped: total,
      totalCorrect: data.correct,
      totalErrors: data.errors,
      accuracy: total > 0 ? Math.round((data.correct / total) * 100) : 100,
      avgLatencyMs: Math.round(avgLatency),
      latencies: data.latencies,
    });
  }

  return results.sort((a, b) => a.letter.localeCompare(b.letter));
}

export function computeConfusionPairs(keystrokes: Keystroke[]): ConfusionPair[] {
  const map = new Map<string, number>();

  for (const k of keystrokes) {
    if (k.correct || k.typedChar === "Backspace") continue;
    const expected = k.expectedChar.toLowerCase();
    const typed = k.typedChar.toLowerCase();
    if (!/^[a-z]$/.test(expected) || !/^[a-z]$/.test(typed)) continue;

    const key = `${expected}->${typed}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([key, count]) => {
      const [expected, typed] = key.split("->");
      return { expected, typed, count };
    })
    .sort((a, b) => b.count - a.count);
}

export interface HeatmapData {
  letter: string;
  errorRate: number;
  avgLatencyMs: number;
  samples: number;
}

export function computeHeatmapData(keystrokes: Keystroke[]): HeatmapData[] {
  const stats = computeLetterStats(keystrokes);
  return stats.map((s) => ({
    letter: s.letter,
    errorRate: s.totalTyped > 0 ? s.totalErrors / s.totalTyped : 0,
    avgLatencyMs: s.avgLatencyMs,
    samples: s.totalTyped,
  }));
}
