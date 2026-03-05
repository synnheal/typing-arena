import { db } from "./db";
import type { Session } from "@/types/test";

export async function saveSession(session: Session): Promise<void> {
  await db.sessions.put(session);
}

export async function getSessions(limit = 50): Promise<Session[]> {
  return db.sessions.orderBy("createdAt").reverse().limit(limit).toArray();
}

export async function getSessionById(id: string): Promise<Session | undefined> {
  return db.sessions.get(id);
}

export async function deleteSession(id: string): Promise<void> {
  await db.sessions.delete(id);
}

export async function getAllSessions(): Promise<Session[]> {
  return db.sessions.orderBy("createdAt").reverse().toArray();
}

export async function getSessionsSince(timestamp: number): Promise<Session[]> {
  return db.sessions
    .where("createdAt")
    .aboveOrEqual(timestamp)
    .reverse()
    .toArray();
}
