"use client";

import { useTestStore } from "@/stores/test-store";
import { useTranslations } from "next-intl";
import { calculateScore } from "@/lib/engine/scorer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResultScreenProps {
  onRestart: () => void;
}

export function ResultScreen({ onRestart }: ResultScreenProps) {
  const t = useTranslations("test");
  const keystrokes = useTestStore((s) => s.keystrokes);
  const duration = useTestStore((s) => s.duration);

  const score = calculateScore(keystrokes, duration);

  const stats = [
    { label: t("wpm"), value: score.wpm, unit: "", highlight: true },
    { label: t("rawWpm"), value: score.rawWpm, unit: "" },
    { label: t("accuracy"), value: score.accuracy, unit: "%" },
    { label: t("consistency"), value: score.consistency, unit: "%" },
    { label: t("correct"), value: score.correctChars, unit: "" },
    { label: t("incorrect"), value: score.incorrectChars, unit: "" },
    { label: t("backspaces"), value: score.backspaces, unit: "" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center">{t("testComplete")}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.highlight ? "border-primary" : ""}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold tabular-nums ${stat.highlight ? "text-primary" : ""}`}>
                {stat.value}{stat.unit}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={onRestart} size="lg">
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}
