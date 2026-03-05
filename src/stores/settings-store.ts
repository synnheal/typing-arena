"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LayoutName } from "@/lib/utils/keyboard-layouts";

interface SettingsState {
  layout: LayoutName;
  language: "en" | "fr";
  duration: number;
  mode: "words" | "sentences";
  setLayout: (layout: LayoutName) => void;
  setLanguage: (language: "en" | "fr") => void;
  setDuration: (duration: number) => void;
  setMode: (mode: "words" | "sentences") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      layout: "QWERTY",
      language: "en",
      duration: 30,
      mode: "words",
      setLayout: (layout) => set({ layout }),
      setLanguage: (language) => set({ language }),
      setDuration: (duration) => set({ duration }),
      setMode: (mode) => set({ mode }),
    }),
    { name: "typing-arena-settings" }
  )
);
