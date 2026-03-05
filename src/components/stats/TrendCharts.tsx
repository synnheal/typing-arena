"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useStatsStore } from "@/stores/stats-store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

export function TrendCharts() {
  const t = useTranslations("stats");
  const sessions = useStatsStore((s) => s.sessions);
  const [range, setRange] = useState<7 | 30 | 0>(7);

  const data = useMemo(() => {
    let filtered = [...sessions].reverse();
    if (range > 0) {
      const since = Date.now() - range * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((s) => s.createdAt >= since);
    }

    return filtered.map((s, i) => ({
      idx: i + 1,
      date: new Date(s.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      wpm: s.wpm,
      accuracy: s.accuracy,
    }));
  }, [sessions, range]);

  if (sessions.length === 0) {
    return <p className="text-muted-foreground text-center py-8">{t("noData")}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={range === 7 ? "default" : "outline"} size="sm" onClick={() => setRange(7)}>
          {t("last7Days")}
        </Button>
        <Button variant={range === 30 ? "default" : "outline"} size="sm" onClick={() => setRange(30)}>
          {t("last30Days")}
        </Button>
        <Button variant={range === 0 ? "default" : "outline"} size="sm" onClick={() => setRange(0)}>
          {t("allTime")}
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">{t("noData")}</p>
      ) : (
        <div className="space-y-6">
          {/* WPM Chart */}
          <div>
            <h4 className="text-sm font-medium mb-2">{t("wpm")}</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Accuracy Chart */}
          <div>
            <h4 className="text-sm font-medium mb-2">{t("accuracy")}</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
