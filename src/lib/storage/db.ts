import Dexie, { type EntityTable } from "dexie";
import type { Session } from "@/types/test";

export interface DailyAggregate {
  id: string; // "YYYY-MM-DD"
  date: string;
  sessionCount: number;
  avgWpm: number;
  avgAccuracy: number;
  avgConsistency: number;
  totalTime: number;
}

const db = new Dexie("TypingArenaDB") as Dexie & {
  sessions: EntityTable<Session, "id">;
  dailyAggregates: EntityTable<DailyAggregate, "id">;
};

db.version(1).stores({
  sessions: "id, createdAt, mode, language",
  dailyAggregates: "id, date",
});

export { db };
