"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";

// Hydration-safe hook for persisted Zustand settings
export function usePersistedSettings() {
  const [hydrated, setHydrated] = useState(false);
  const settings = useSettingsStore();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return { ...settings, hydrated };
}
