import type { LetterStats, ConfusionPair } from "@/types/test";
import type { WeaknessScore, Drill, TrainingPlan } from "@/types/training";
import { generateDrillText } from "./generator";

const W_ERROR = 0.5;
const W_LATENCY = 0.3;
const W_CONFUSION = 0.2;

export function computeWeaknesses(
  letterStats: LetterStats[],
  confusionPairs: ConfusionPair[]
): WeaknessScore[] {
  if (letterStats.length === 0) return [];

  const allLatencies = letterStats.flatMap((s) => s.latencies);
  const meanLatency = allLatencies.length > 0
    ? allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length
    : 0;
  const stdLatency = allLatencies.length > 1
    ? Math.sqrt(allLatencies.reduce((sum, l) => sum + (l - meanLatency) ** 2, 0) / allLatencies.length)
    : 1;

  const confusionMap = new Map<string, number>();
  for (const cp of confusionPairs) {
    const current = confusionMap.get(cp.expected) || 0;
    confusionMap.set(cp.expected, current + cp.count);
  }
  const maxConfusion = Math.max(1, ...Array.from(confusionMap.values()));

  return letterStats
    .filter((s) => s.totalTyped >= 3)
    .map((s) => {
      const errorRate = s.totalTyped > 0 ? s.totalErrors / s.totalTyped : 0;
      const latencyZScore = stdLatency > 0
        ? (s.avgLatencyMs - meanLatency) / stdLatency
        : 0;
      const confusionPenalty = (confusionMap.get(s.letter) || 0) / maxConfusion;

      const score =
        errorRate * W_ERROR +
        Math.max(0, latencyZScore) * W_LATENCY +
        confusionPenalty * W_CONFUSION;

      return {
        letter: s.letter,
        score,
        errorRate,
        latencyZScore,
        confusionPenalty,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function generateTrainingPlan(
  weaknesses: WeaknessScore[],
  language: "en" | "fr" = "en"
): TrainingPlan {
  const topWeak = weaknesses.slice(0, 5);
  if (topWeak.length === 0) {
    return {
      date: new Date().toISOString().slice(0, 10),
      weakLetters: [],
      drills: [],
      estimatedMinutes: 0,
    };
  }

  const targetLetters = topWeak.map((w) => w.letter);
  const drills: Drill[] = [];

  // Drill 1: Letter repetition
  const repLetters = targetLetters.slice(0, 3);
  drills.push({
    id: `drill-rep-${Date.now()}`,
    type: "repetition",
    targetLetters: repLetters,
    text: generateRepetitionDrill(repLetters),
    description: `Focus on: ${repLetters.join(", ")}`,
  });

  // Drill 2: Bigrams
  const bigramText = generateBigramDrill(targetLetters);
  drills.push({
    id: `drill-bi-${Date.now()}`,
    type: "bigrams",
    targetLetters,
    text: bigramText,
    description: `Bigram practice with ${targetLetters.slice(0, 3).join(", ")}`,
  });

  // Drill 3: Words containing weak letters
  drills.push({
    id: `drill-words-${Date.now()}`,
    type: "weakWords",
    targetLetters,
    text: generateDrillText(targetLetters, language, 30),
    description: `Words heavy in ${targetLetters.slice(0, 3).join(", ")}`,
  });

  return {
    date: new Date().toISOString().slice(0, 10),
    weakLetters: topWeak,
    drills,
    estimatedMinutes: drills.length * 3,
  };
}

function generateRepetitionDrill(letters: string[]): string {
  const patterns: string[] = [];
  for (const l of letters) {
    patterns.push(`${l}${l}${l} ${l}${l} ${l}${l}${l}${l}`);
    patterns.push(`${l}a${l}e${l}i${l}o${l}u`);
  }
  for (let i = 0; i < letters.length - 1; i++) {
    const a = letters[i], b = letters[i + 1];
    patterns.push(`${a}${b} ${b}${a} ${a}${b}${a} ${b}${a}${b}`);
  }
  return patterns.join(" ");
}

function generateBigramDrill(letters: string[]): string {
  const vowels = "aeiou".split("");
  const bigrams: string[] = [];
  for (const l of letters) {
    for (const v of vowels) {
      bigrams.push(`${l}${v}`, `${v}${l}`);
    }
  }
  for (let i = 0; i < letters.length - 1; i++) {
    bigrams.push(`${letters[i]}${letters[i + 1]}`, `${letters[i + 1]}${letters[i]}`);
  }
  // Shuffle and join
  const shuffled = bigrams.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 40).join(" ");
}
