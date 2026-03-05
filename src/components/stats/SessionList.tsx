"use client";

import { useTranslations } from "next-intl";
import { useStatsStore } from "@/stores/stats-store";
import { formatDate, formatDuration } from "@/lib/utils/time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SessionList() {
  const t = useTranslations("stats");
  const sessions = useStatsStore((s) => s.sessions);

  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">{t("noData")}</p>
    );
  }

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead className="text-right">{t("wpm")}</TableHead>
            <TableHead className="text-right">{t("accuracy")}</TableHead>
            <TableHead className="text-right">{t("duration")}</TableHead>
            <TableHead>{t("mode")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.slice(0, 20).map((session) => (
            <TableRow key={session.id}>
              <TableCell className="text-sm">
                {formatDate(session.createdAt)}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {session.wpm}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {session.accuracy}%
              </TableCell>
              <TableCell className="text-right text-sm">
                {formatDuration(session.duration)}
              </TableCell>
              <TableCell className="text-sm capitalize">
                {session.mode}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
