"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useStatsStore } from "@/stores/stats-store";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey = "letter" | "accuracy" | "avgLatencyMs" | "totalTyped";

export function LetterTable() {
  const t = useTranslations("stats");
  const letterStats = useStatsStore((s) => s.letterStats);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("accuracy");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let data = [...letterStats];
    if (search) {
      data = data.filter((s) => s.letter.includes(search.toLowerCase()));
    }
    data.sort((a, b) => {
      if (sortKey === "letter") {
        return sortAsc ? a.letter.localeCompare(b.letter) : b.letter.localeCompare(a.letter);
      }
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortAsc ? av - bv : bv - av;
    });
    return data;
  }, [letterStats, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "letter");
    }
  };

  if (letterStats.length === 0) {
    return <p className="text-muted-foreground text-center py-8">{t("noData")}</p>;
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder={`${t("letter")}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-[200px]"
      />

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("letter")}>
                {t("letter")} {sortKey === "letter" ? (sortAsc ? "↑" : "↓") : ""}
              </TableHead>
              <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("accuracy")}>
                {t("accuracy")} {sortKey === "accuracy" ? (sortAsc ? "↑" : "↓") : ""}
              </TableHead>
              <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("avgLatencyMs")}>
                {t("avgLatency")} {sortKey === "avgLatencyMs" ? (sortAsc ? "↑" : "↓") : ""}
              </TableHead>
              <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("totalTyped")}>
                {t("samples")} {sortKey === "totalTyped" ? (sortAsc ? "↑" : "↓") : ""}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((stat) => (
              <TableRow key={stat.letter}>
                <TableCell className="font-mono font-bold text-lg">
                  {stat.letter.toUpperCase()}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  <span className={stat.accuracy < 80 ? "text-destructive" : stat.accuracy < 95 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}>
                    {stat.accuracy}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-sm">
                  {stat.avgLatencyMs}ms
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {stat.totalTyped}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
