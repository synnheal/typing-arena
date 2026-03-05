export interface WeaknessScore {
  letter: string;
  score: number;
  errorRate: number;
  latencyZScore: number;
  confusionPenalty: number;
}

export type DrillType = "repetition" | "bigrams" | "weakWords";

export interface Drill {
  id: string;
  type: DrillType;
  targetLetters: string[];
  text: string;
  description: string;
}

export interface TrainingPlan {
  date: string;
  weakLetters: WeaknessScore[];
  drills: Drill[];
  estimatedMinutes: number;
}

export interface LetterMastery {
  letter: string;
  mastery: number; // 0-100
  sessionsTracked: number;
}
