"use client";

import { create } from "zustand";
import type { Keystroke, TestStatus } from "@/types/test";

interface TestState {
  targetText: string;
  position: number;
  keystrokes: Keystroke[];
  status: TestStatus;
  startTime: number | null;
  endTime: number | null;
  timeLeft: number;
  duration: number;
  currentError: string | null; // blocked on this wrong char

  setTargetText: (text: string) => void;
  setDuration: (d: number) => void;
  start: () => void;
  addKeystroke: (k: Keystroke) => void;
  advancePosition: () => void;
  retreatPosition: () => void;
  setCurrentError: (char: string | null) => void;
  finish: () => void;
  reset: () => void;
  tick: () => void;
  setTimeLeft: (t: number) => void;
}

export const useTestStore = create<TestState>()((set, get) => ({
  targetText: "",
  position: 0,
  keystrokes: [],
  status: "idle",
  startTime: null,
  endTime: null,
  timeLeft: 30,
  duration: 30,
  currentError: null,

  setTargetText: (text) => set({ targetText: text }),
  setDuration: (d) => set({ duration: d, timeLeft: d }),

  start: () =>
    set({
      status: "running",
      startTime: Date.now(),
      endTime: null,
    }),

  addKeystroke: (k) =>
    set((state) => ({ keystrokes: [...state.keystrokes, k] })),

  advancePosition: () =>
    set((state) => ({ position: state.position + 1 })),

  retreatPosition: () =>
    set((state) => ({ position: Math.max(0, state.position - 1) })),

  setCurrentError: (char) => set({ currentError: char }),

  finish: () =>
    set({
      status: "finished",
      endTime: Date.now(),
    }),

  reset: () =>
    set({
      position: 0,
      keystrokes: [],
      status: "idle",
      startTime: null,
      endTime: null,
      timeLeft: get().duration,
      currentError: null,
    }),

  tick: () =>
    set((state) => {
      const next = state.timeLeft - 1;
      if (next <= 0) {
        return { timeLeft: 0, status: "finished", endTime: Date.now() };
      }
      return { timeLeft: next };
    }),

  setTimeLeft: (t) => set({ timeLeft: t }),
}));
