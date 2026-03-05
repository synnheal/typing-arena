"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeyCapProps {
  letter: string;
  intensity: number; // 0-1
  mode: "errors" | "speed";
  details?: string;
}

function getColor(intensity: number, mode: "errors" | "speed"): string {
  if (intensity <= 0) return "bg-muted";

  if (mode === "errors") {
    // Green -> Yellow -> Red
    if (intensity < 0.3) return "bg-green-500/30 text-green-900 dark:text-green-200";
    if (intensity < 0.6) return "bg-yellow-500/40 text-yellow-900 dark:text-yellow-200";
    return "bg-red-500/50 text-red-900 dark:text-red-200";
  }

  // Speed: Blue -> Orange -> Red (slow = hot)
  if (intensity < 0.3) return "bg-blue-500/30 text-blue-900 dark:text-blue-200";
  if (intensity < 0.6) return "bg-orange-500/40 text-orange-900 dark:text-orange-200";
  return "bg-red-500/50 text-red-900 dark:text-red-200";
}

export function KeyCap({ letter, intensity, mode, details }: KeyCapProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center justify-center rounded-md border font-mono text-sm font-medium w-10 h-10 transition-colors cursor-default",
            getColor(intensity, mode)
          )}
        >
          {letter.toUpperCase()}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{details || letter}</p>
      </TooltipContent>
    </Tooltip>
  );
}
