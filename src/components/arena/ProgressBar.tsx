"use client";

import { useTestStore } from "@/stores/test-store";
import { Progress } from "@/components/ui/progress";

export function ProgressBar() {
  const timeLeft = useTestStore((s) => s.timeLeft);
  const duration = useTestStore((s) => s.duration);
  const status = useTestStore((s) => s.status);

  const pct = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <Progress value={pct} className="flex-1 h-2" />
      <span className="text-sm font-mono text-muted-foreground w-10 text-right tabular-nums">
        {status === "idle" ? duration : timeLeft}s
      </span>
    </div>
  );
}
