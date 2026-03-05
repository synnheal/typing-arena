"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatsStore } from "@/stores/stats-store";
import { getLayout } from "@/lib/utils/keyboard-layouts";
import { KeyCap } from "./KeyCap";
import { Button } from "@/components/ui/button";

export function KeyboardHeatmap() {
  const t = useTranslations("stats");
  const [viewMode, setViewMode] = useState<"errors" | "speed">("errors");
  const layout = useSettingsStore((s) => s.layout);
  const heatmapData = useStatsStore((s) => s.heatmapData);

  const keyLayout = getLayout(layout);

  const maxError = Math.max(0.01, ...heatmapData.map((d) => d.errorRate));
  const maxLatency = Math.max(1, ...heatmapData.map((d) => d.avgLatencyMs));

  const getIntensity = (letter: string): number => {
    const data = heatmapData.find((d) => d.letter === letter);
    if (!data || data.samples === 0) return 0;
    if (viewMode === "errors") return data.errorRate / maxError;
    return data.avgLatencyMs / maxLatency;
  };

  const getDetails = (letter: string): string => {
    const data = heatmapData.find((d) => d.letter === letter);
    if (!data) return `${letter}: no data`;
    if (viewMode === "errors") {
      return `${letter.toUpperCase()}: ${(data.errorRate * 100).toFixed(1)}% errors (${data.samples} samples)`;
    }
    return `${letter.toUpperCase()}: ${Math.round(data.avgLatencyMs)}ms avg (${data.samples} samples)`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={viewMode === "errors" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("errors")}
        >
          {t("viewErrors")}
        </Button>
        <Button
          variant={viewMode === "speed" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("speed")}
        >
          {t("viewSpeed")}
        </Button>
      </div>

      <div className="space-y-1.5">
        {keyLayout.rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-1.5 justify-center"
            style={{ paddingLeft: `${rowIdx * 16}px` }}
          >
            {row.map((key) => (
              <KeyCap
                key={key}
                letter={key}
                intensity={getIntensity(key)}
                mode={viewMode}
                details={getDetails(key)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>{viewMode === "errors" ? "Low errors" : "Fast"}</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-3 rounded-sm bg-green-500/30" />
          <div className="w-4 h-3 rounded-sm bg-yellow-500/40" />
          <div className="w-4 h-3 rounded-sm bg-red-500/50" />
        </div>
        <span>{viewMode === "errors" ? "High errors" : "Slow"}</span>
      </div>
    </div>
  );
}
