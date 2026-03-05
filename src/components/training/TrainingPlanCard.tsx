"use client";

import { useTranslations } from "next-intl";
import type { TrainingPlan } from "@/types/training";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrainingPlanCardProps {
  plan: TrainingPlan;
}

export function TrainingPlanCard({ plan }: TrainingPlanCardProps) {
  const t = useTranslations("training");

  if (plan.weakLetters.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          {t("noWeaknesses")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("dailyPlan")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          ~{plan.estimatedMinutes} min
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">{t("weakLetters")}</h4>
          <div className="flex gap-2 flex-wrap">
            {plan.weakLetters.map((w) => (
              <Badge key={w.letter} variant="secondary" className="font-mono text-base px-3">
                {w.letter.toUpperCase()}
                <span className="text-xs ml-1 text-muted-foreground">
                  ({(w.errorRate * 100).toFixed(0)}%)
                </span>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">{t("drills")} ({plan.drills.length})</h4>
          <div className="space-y-2">
            {plan.drills.map((drill) => (
              <div key={drill.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div>
                  <span className="text-sm font-medium capitalize">{drill.type}</span>
                  <p className="text-xs text-muted-foreground">{drill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
