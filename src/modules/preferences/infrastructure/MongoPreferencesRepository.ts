import type { Db } from "mongodb";
import type { PreferencesRepository } from "../application/PreferencesRepository";
import { UserPreferencesEntity } from "../entities/UserPreferencesEntity";

type Document = Record<string, unknown>;

function mapPreferences(doc: Document): UserPreferencesEntity {
  const reminder = (doc.reminder ?? {}) as Document;
  const naamJapTarget = doc.naamJapTarget as { repetitions: number } | undefined;
  const meditationTarget = doc.meditationTarget as { minutes: number } | undefined;
  return new UserPreferencesEntity(
    String(doc._id ?? ""), String(doc.userId ?? ""), String(doc.traditionId ?? ""),
    Array.isArray(doc.enabledPractices) ? doc.enabledPractices as UserPreferencesEntity["enabledPractices"] : [],
    String(doc.language ?? "en"),
    { enabled: Boolean(reminder.enabled), localTime: String(reminder.localTime ?? "07:00") },
    typeof doc.primaryFocusId === "string" ? doc.primaryFocusId : undefined,
    naamJapTarget, meditationTarget,
    doc.createdAt instanceof Date ? doc.createdAt : new Date(String(doc.createdAt)),
    doc.updatedAt instanceof Date ? doc.updatedAt : new Date(String(doc.updatedAt)),
  );
}

export class MongoPreferencesRepository implements PreferencesRepository {
  constructor(private readonly db: Db) {}

  async findByUserId(userId: string): Promise<UserPreferencesEntity | null> {
    const doc = await this.db.collection<Document>("user_preferences").findOne({ userId });
    return doc ? mapPreferences(doc) : null;
  }

  async save(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity> {
    await this.db.collection<Document>("user_preferences").replaceOne(
      { userId: preferences.userId },
      { ...preferences, updatedAt: new Date() },
      { upsert: true },
    );
    return preferences;
  }
}
