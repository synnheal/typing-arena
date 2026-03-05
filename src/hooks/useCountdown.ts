"use client";

import { useEffect, useRef } from "react";
import { useTestStore } from "@/stores/test-store";

export function useCountdown() {
  const status = useTestStore((s) => s.status);
  const tick = useTestStore((s) => s.tick);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, tick]);
}
