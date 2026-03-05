import { db, type DailyAggregate } from "./db";
import type { Session } from "@/types/test";

function dateKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export async function updateDailyAggregate(session: Session): Promise<void> {
  const key = dateKey(session.createdAt);
  const existing = await db.dailyAggregates.get(key);

  if (existing) {
    const n = existing.sessionCount;
    await db.dailyAggregates.put({
      id: key,
      date: key,
      sessionCount: n + 1,
      avgWpm: (existing.avgWpm * n + session.wpm) / (n + 1),
      avgAccuracy: (existing.avgAccuracy * n + session.accuracy) / (n + 1),
      avgConsistency: (existing.avgConsistency * n + session.consistency) / (n + 1),
      totalTime: existing.totalTime + session.duration,
    });
  } else {
    await db.dailyAggregates.put({
      id: key,
      date: key,
      sessionCount: 1,
      avgWpm: session.wpm,
      avgAccuracy: session.accuracy,
      avgConsistency: session.consistency,
      totalTime: session.duration,
    });
  }
}

export async function getDailyAggregates(days = 30): Promise<DailyAggregate[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceKey = since.toISOString().slice(0, 10);

  return db.dailyAggregates
    .where("date")
    .aboveOrEqual(sinceKey)
    .sortBy("date");
}

export async function getAllAggregates(): Promise<DailyAggregate[]> {
  return db.dailyAggregates.orderBy("date").toArray();
}
