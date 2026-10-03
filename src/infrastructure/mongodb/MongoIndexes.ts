import type { Db } from "mongodb";

const indexes = [
  ["users", { authProvider: 1, authSubject: 1 }, { unique: true }],
  ["users", { status: 1, createdAt: -1 }, {}],
  ["user_preferences", { userId: 1 }, { unique: true }],
  ["traditions", { status: 1, sortOrder: 1 }, {}],
  ["focuses", { status: 1, sortOrder: 1 }, {}],
  ["focuses", { traditionIds: 1, status: 1 }, {}],
  ["tags", { status: 1, type: 1 }, {}],
  ["mantras", { status: 1, language: 1, createdAt: -1 }, {}],
  ["naam_jap_sessions", { userId: 1, clientSessionId: 1 }, { unique: true }],
  ["naam_jap_sessions", { userId: 1, startedAt: -1 }, {}],
  ["meditation_presets", { status: 1, sortOrder: 1 }, {}],
  ["meditation_sessions", { userId: 1, clientSessionId: 1 }, { unique: true }],
  ["daily_goals", { userId: 1, localDate: 1 }, { unique: true }],
  ["daily_progress", { userId: 1, localDate: 1 }, { unique: true }],
  ["daily_progress", { userId: 1, dayCompleted: 1, localDate: -1 }, {}],
  ["device_registrations", { userId: 1, deviceId: 1 }, { unique: true }],
] as const;

export async function ensureDatabaseIndexes(db: Db): Promise<void> {
  for (const [collection, definition, options] of indexes) {
    await db.collection(collection).createIndex(definition, {
      ...options,
      name: `${collection}_${Object.keys(definition).join("_")}`,
    });
  }
}
