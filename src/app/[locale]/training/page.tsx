"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useStatsStore } from "@/stores/stats-store";
import { useSettingsStore } from "@/stores/settings-store";
import { computeWeaknesses, generateTrainingPlan } from "@/lib/engine/training";
import type { Drill, TrainingPlan } from "@/types/training";
import { TrainingPlanCard } from "@/components/training/TrainingPlanCard";
import { DrillPicker } from "@/components/training/DrillPicker";
import { DrillRunner } from "@/components/training/DrillRunner";

export default function TrainingPage() {
  const t = useTranslations("training");
  const loadSessions = useStatsStore((s) => s.loadSessions);
  const letterStats = useStatsStore((s) => s.letterStats);
  const confusionPairs = useStatsStore((s) => s.confusionPairs);
  const language = useSettingsStore((s) => s.language);
  const [activeDrill, setActiveDrill] = useState<Drill | null>(null);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const plan: TrainingPlan = useMemo(() => {
    const weaknesses = computeWeaknesses(letterStats, confusionPairs);
    return generateTrainingPlan(weaknesses, language);
  }, [letterStats, confusionPairs, language]);

  if (activeDrill) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <DrillRunner
          drill={activeDrill}
          onComplete={() => setActiveDrill(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <TrainingPlanCard plan={plan} />
      {plan.drills.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("drills")}</h2>
          <DrillPicker drills={plan.drills} onSelect={setActiveDrill} />
        </div>
      )}
    </div>
  );
}
