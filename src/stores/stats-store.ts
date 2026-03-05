"use client";

import { create } from "zustand";
import type { Session, LetterStats, ConfusionPair } from "@/types/test";
import { computeLetterStats, computeConfusionPairs, type HeatmapData, computeHeatmapData } from "@/lib/engine/keystats";
import { getAllSessions } from "@/lib/storage/sessions";

interface StatsState {
  sessions: Session[];
  letterStats: LetterStats[];
  confusionPairs: ConfusionPair[];
  heatmapData: HeatmapData[];
  loaded: boolean;
  loadSessions: () => Promise<void>;
  addSession: (session: Session) => void;
}

export const useStatsStore = create<StatsState>()((set, get) => ({
  sessions: [],
  letterStats: [],
  confusionPairs: [],
  heatmapData: [],
  loaded: false,

  loadSessions: async () => {
    if (get().loaded) return;
    const sessions = await getAllSessions();
    const allKeystrokes = sessions.flatMap((s) => s.keystrokes);
    set({
      sessions,
      letterStats: computeLetterStats(allKeystrokes),
      confusionPairs: computeConfusionPairs(allKeystrokes),
      heatmapData: computeHeatmapData(allKeystrokes),
      loaded: true,
    });
  },

  addSession: (session) => {
    const sessions = [session, ...get().sessions];
    const allKeystrokes = sessions.flatMap((s) => s.keystrokes);
    set({
      sessions,
      letterStats: computeLetterStats(allKeystrokes),
      confusionPairs: computeConfusionPairs(allKeystrokes),
      heatmapData: computeHeatmapData(allKeystrokes),
    });
  },
}));
