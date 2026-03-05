"use client";

import { useTranslations } from "next-intl";
import type { Drill } from "@/types/training";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DrillPickerProps {
  drills: Drill[];
  onSelect: (drill: Drill) => void;
}

const DRILL_LABELS: Record<string, string> = {
  repetition: "repetition",
  bigrams: "bigrams",
  weakWords: "weakWords",
};

export function DrillPicker({ drills, onSelect }: DrillPickerProps) {
  const t = useTranslations("training");

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {drills.map((drill) => (
        <Card key={drill.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => onSelect(drill)}>
          <CardContent className="p-4 space-y-2">
            <h4 className="font-medium text-sm">
              {t(DRILL_LABELS[drill.type] || drill.type)}
            </h4>
            <p className="text-xs text-muted-foreground">{drill.description}</p>
            <Button size="sm" className="w-full">
              {t("startDrill")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
