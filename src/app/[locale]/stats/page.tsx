"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useStatsStore } from "@/stores/stats-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionList } from "@/components/stats/SessionList";
import { LetterTable } from "@/components/stats/LetterTable";
import { TrendCharts } from "@/components/stats/TrendCharts";
import { KeyboardHeatmap } from "@/components/keyboard/KeyboardHeatmap";

export default function StatsPage() {
  const t = useTranslations("stats");
  const loadSessions = useStatsStore((s) => s.loadSessions);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">{t("sessions")}</TabsTrigger>
          <TabsTrigger value="letters">{t("letterStats")}</TabsTrigger>
          <TabsTrigger value="trends">{t("trends")}</TabsTrigger>
          <TabsTrigger value="heatmap">{t("heatmap")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-4">
          <SessionList />
        </TabsContent>

        <TabsContent value="letters" className="mt-4">
          <LetterTable />
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <TrendCharts />
        </TabsContent>

        <TabsContent value="heatmap" className="mt-4">
          <KeyboardHeatmap />
        </TabsContent>
      </Tabs>
    </div>
  );
}
