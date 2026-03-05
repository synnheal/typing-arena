export interface Keystroke {
  t: number; // timestamp ms
  expectedChar: string;
  typedChar: string;
  correct: boolean;
  keyCode: string;
  latencyMs: number;
}

export interface Session {
  id: string;
  createdAt: number;
  duration: number; // seconds
  mode: "words" | "sentences";
  language: "en" | "fr";
  targetText: string;
  keystrokes: Keystroke[];
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  backspaces: number;
}

export interface LetterStats {
  letter: string;
  totalTyped: number;
  totalCorrect: number;
  totalErrors: number;
  accuracy: number;
  avgLatencyMs: number;
  latencies: number[];
}

export interface ConfusionPair {
  expected: string;
  typed: string;
  count: number;
}

export type TestStatus = "idle" | "running" | "paused" | "finished";
