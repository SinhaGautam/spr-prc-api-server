import type { Db, Collection } from "mongodb";
import {
  DailyGoalSnapshot,
  Focus,
  Mantra,
  MediaAsset,
  MeditationPreset,
  MeditationSession,
  Tag,
  Tradition,
  User,
  UserPreferences,
} from "../../shared/domain/entities";
import type {
  DailyGoalRepository,
  DailyProgressRepository,
  FocusRepository,
  MantraRepository,
  MediaAssetRepository,
  MeditationPresetRepository,
  MeditationSessionRepository,
  TagRepository,
  TraditionRepository,
  UserPreferencesRepository,
  UserRepository,
} from "../../shared/application/repositories";
import type { ObjectId, Practice } from "../../shared/domain/types";

type JsonDoc = Record<string, unknown>;

function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  return new Date(String(value));
}

function mapUser(doc: JsonDoc): User {
  return new User(
    String(doc._id ?? ""),
    String(doc.authProvider ?? ""),
    String(doc.authSubject ?? ""),
    String(doc.timezone ?? "UTC"),
    String(doc.language ?? "en"),
    String(doc.status ?? "active") as User["status"],
    typeof doc.displayName === "string" ? doc.displayName : undefined,
    typeof doc.email === "string" ? doc.email : undefined,
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapUserPreferences(doc: JsonDoc): UserPreferences {
  return new UserPreferences(
    String(doc._id ?? ""),
    String(doc.userId ?? ""),
    String(doc.traditionId ?? ""),
    Array.isArray(doc.enabledPractices) ? (doc.enabledPractices as string[] as UserPreferences["enabledPractices"]) : [],
    String(doc.language ?? "en"),
    {
      enabled: !!(doc.reminder && (doc.reminder as JsonDoc).enabled),
      localTime: String((doc.reminder as JsonDoc)?.localTime ?? "07:00"),
    },
    typeof doc.primaryFocusId === "string" ? doc.primaryFocusId : undefined,
    typeof doc.naamJapTarget === "object" && doc.naamJapTarget !== null ? (doc.naamJapTarget as { repetitions: number }) : undefined,
    typeof doc.meditationTarget === "object" && doc.meditationTarget !== null ? (doc.meditationTarget as { minutes: number }) : undefined,
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapMantra(doc: JsonDoc): Mantra {
  return new Mantra(
    String(doc._id ?? ""),
    String(doc.name ?? ""),
    String(doc.text ?? ""),
    Array.isArray(doc.traditionIds) ? doc.traditionIds.map(String) : [],
    Array.isArray(doc.focusIds) ? doc.focusIds.map(String) : [],
    String(doc.language ?? "en"),
    String(doc.status ?? "draft") as Mantra["status"],
    typeof doc.transliteration === "string" ? doc.transliteration : undefined,
    typeof doc.pronunciationNote === "string" ? doc.pronunciationNote : undefined,
    typeof doc.meaning === "string" ? doc.meaning : undefined,
    typeof doc.audioAssetId === "string" ? doc.audioAssetId : undefined,
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapMeditationPreset(doc: JsonDoc): MeditationPreset {
  return new MeditationPreset(
    String(doc._id ?? ""),
    String(doc.key ?? ""),
    Number(doc.durationMinutes ?? 0),
    String(doc.status ?? "draft") as MeditationPreset["status"],
    Number(doc.sortOrder ?? 0),
    typeof doc.startBellAssetId === "string" ? doc.startBellAssetId : undefined,
    typeof doc.endBellAssetId === "string" ? doc.endBellAssetId : undefined,
    typeof doc.ambientAssetId === "string" ? doc.ambientAssetId : undefined,
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapMeditationSession(doc: JsonDoc): MeditationSession {
  return new MeditationSession(
    String(doc._id ?? ""),
    String(doc.userId ?? ""),
    Number(doc.plannedMinutes ?? 0),
    Number(doc.actualSeconds ?? 0),
    toDate(doc.startedAt),
    !!doc.completed,
    String(doc.clientSessionId ?? ""),
    typeof doc.presetId === "string" ? doc.presetId : undefined,
    doc.endedAt ? toDate(doc.endedAt) : undefined,
    typeof doc.completionReason === "string" ? (doc.completionReason as MeditationSession["completionReason"]) : undefined,
    toDate(doc.createdAt),
  );
}

function mapDailyGoalSnapshot(doc: JsonDoc): DailyGoalSnapshot {
  return new DailyGoalSnapshot(
    String(doc._id ?? ""),
    String(doc.userId ?? ""),
    String(doc.localDate ?? ""),
    Array.isArray(doc.enabledPractices) ? (doc.enabledPractices as Practice[]) : [],
    !!((doc.naamJap as JsonDoc)?.completed),
    !!((doc.meditation as JsonDoc)?.completed),
    !!doc.allComplete,
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapFocus(doc: JsonDoc): Focus {
  return new Focus(
    String(doc._id ?? ""),
    String(doc.key ?? ""),
    String(doc.name ?? ""),
    Array.isArray(doc.traditionIds) ? doc.traditionIds.map(String) : [],
    String(doc.status ?? "draft") as Focus["status"],
    Number(doc.sortOrder ?? 0),
    Array.isArray(doc.aliases) ? doc.aliases.map(String) : undefined,
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapTag(doc: JsonDoc): Tag {
  return new Tag(
    String(doc._id ?? ""),
    String(doc.key ?? ""),
    String(doc.name ?? ""),
    String(doc.type ?? "theme") as Tag["type"],
    String(doc.status ?? "draft") as Tag["status"],
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapMediaAsset(doc: JsonDoc): MediaAsset {
  return new MediaAsset(
    String(doc._id ?? ""),
    String(doc.type ?? "audio") as MediaAsset["type"],
    String(doc.storageKey ?? ""),
    String(doc.cdnUrl ?? ""),
    String(doc.mimeType ?? "application/octet-stream"),
    Number(doc.sizeBytes ?? 0),
    String(doc.status ?? "ready") as MediaAsset["status"],
    typeof doc.durationSeconds === "number" ? doc.durationSeconds : undefined,
    typeof doc.checksum === "string" ? doc.checksum : undefined,
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

function mapTradition(doc: JsonDoc): Tradition {
  return new Tradition(
    String(doc._id ?? ""),
    String(doc.key ?? ""),
    String(doc.name ?? ""),
    String(doc.status ?? "draft") as Tradition["status"],
    Number(doc.sortOrder ?? 0),
    toDate(doc.createdAt),
    toDate(doc.updatedAt),
  );
}

export class MongoUserRepository implements UserRepository {
  constructor(private readonly db: Db) {}

  private users(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("users");
  }

  async findById(id: ObjectId): Promise<User | null> {
    const doc = await this.users().findOne({ _id: id } as JsonDoc);
    return doc ? mapUser(doc as JsonDoc) : null;
  }

  async findByAuth(authProvider: string, authSubject: string): Promise<User | null> {
    const doc = await this.users().findOne({ authProvider, authSubject } as JsonDoc);
    return doc ? mapUser(doc as JsonDoc) : null;
  }

  async create(user: User): Promise<User> {
    await this.users().insertOne({ ...user, _id: user._id } as JsonDoc);
    return user;
  }

  async update(user: User): Promise<User> {
    const result = await this.users().replaceOne({ _id: user._id } as JsonDoc, { ...user, updatedAt: new Date() } as JsonDoc);
    if (result.matchedCount === 0) {
      throw new Error(`User ${user._id} was not found`);
    }
    return user;
  }
}

export class MongoUserPreferencesRepository implements UserPreferencesRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("user_preferences");
  }

  async findByUserId(userId: ObjectId): Promise<UserPreferences | null> {
    const doc = await this.collection().findOne({ userId } as JsonDoc);
    return doc ? mapUserPreferences(doc as JsonDoc) : null;
  }

  async create(preferences: UserPreferences): Promise<UserPreferences> {
    await this.collection().insertOne({ ...preferences, _id: preferences._id } as JsonDoc);
    return preferences;
  }

  async update(preferences: UserPreferences): Promise<UserPreferences> {
    const result = await this.collection().replaceOne({ _id: preferences._id } as JsonDoc, { ...preferences, updatedAt: new Date() } as JsonDoc);
    if (result.matchedCount === 0) {
      throw new Error(`User preferences ${preferences._id} were not found`);
    }
    return preferences;
  }
}

export class MongoMantraRepository implements MantraRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("mantras");
  }

  async listPublished(): Promise<Mantra[]> {
    const docs = await this.collection().find({ status: "published" } as JsonDoc).toArray();
    return docs.map((doc) => mapMantra(doc as JsonDoc));
  }

  async findById(id: ObjectId): Promise<Mantra | null> {
    const doc = await this.collection().findOne({ _id: id } as JsonDoc);
    return doc ? mapMantra(doc as JsonDoc) : null;
  }
}

export { MongoNaamJapSessionRepository } from "../../modules/naam-jap/infrastructure/naamJapRepository";

export class MongoMeditationPresetRepository implements MeditationPresetRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("meditation_presets");
  }

  async listPublished(): Promise<MeditationPreset[]> {
    const docs = await this.collection().find({ status: "published" } as JsonDoc).toArray();
    return docs.map((doc) => mapMeditationPreset(doc as JsonDoc));
  }

  async findById(id: ObjectId): Promise<MeditationPreset | null> {
    const doc = await this.collection().findOne({ _id: id } as JsonDoc);
    return doc ? mapMeditationPreset(doc as JsonDoc) : null;
  }
}

export class MongoMeditationSessionRepository implements MeditationSessionRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("meditation_sessions");
  }

  async create(session: MeditationSession): Promise<MeditationSession> {
    await this.collection().insertOne({ ...session, _id: session._id } as JsonDoc);
    return session;
  }

  async findByClientSessionId(userId: ObjectId, clientSessionId: string): Promise<MeditationSession | null> {
    const doc = await this.collection().findOne({ userId, clientSessionId } as JsonDoc);
    return doc ? mapMeditationSession(doc as JsonDoc) : null;
  }

  async listByUser(userId: ObjectId): Promise<MeditationSession[]> {
    const docs = await this.collection().find({ userId } as JsonDoc).sort({ startedAt: -1 }).toArray();
    return docs.map((doc) => mapMeditationSession(doc as JsonDoc));
  }
}

export class MongoDailyGoalRepository implements DailyGoalRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("daily_goals");
  }

  async getForUserAndDate(userId: ObjectId, date: string): Promise<DailyGoalSnapshot | null> {
    const doc = await this.collection().findOne({ userId, localDate: date } as JsonDoc);
    return doc ? mapDailyGoalSnapshot(doc as JsonDoc) : null;
  }

  async save(snapshot: DailyGoalSnapshot): Promise<DailyGoalSnapshot> {
    await this.collection().updateOne(
      { userId: snapshot.userId, localDate: snapshot.date } as JsonDoc,
      { $set: { ...snapshot, updatedAt: new Date() } } as JsonDoc,
      { upsert: true },
    );
    return snapshot;
  }
}

export class MongoDailyProgressRepository implements DailyProgressRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("daily_progress");
  }

  async getTodayProgress(userId: ObjectId, date: string): Promise<Record<Practice, boolean>> {
    const doc = await this.collection().findOne({ userId, localDate: date } as JsonDoc);

    if (!doc) {
      return { naam_jap: false, meditation: false };
    }

    return {
      naam_jap: !!((doc.naamJap as JsonDoc)?.completed),
      meditation: !!((doc.meditation as JsonDoc)?.completed),
    };
  }

  async getHistory(userId: ObjectId, month: string): Promise<Array<{ date: string; complete: boolean }>> {
    const docs = await this.collection().find({ userId, localDate: { $regex: `^${month}` } } as JsonDoc).sort({ localDate: -1 }).toArray();

    return docs.map((doc) => ({
      date: String((doc.localDate as string) ?? ""),
      complete: !!doc.dayCompleted,
    }));
  }

  async getCurrentStreak(userId: ObjectId): Promise<number> {
    const docs = await this.collection().find({ userId } as JsonDoc).sort({ localDate: -1 }).toArray();
    let streak = 0;

    for (const doc of docs) {
      if (doc.dayCompleted) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  }

  async getLongestStreak(userId: ObjectId): Promise<number> {
    const docs = await this.collection().find({ userId } as JsonDoc).sort({ localDate: 1 }).toArray();
    let longest = 0;
    let current = 0;

    for (const doc of docs) {
      if (doc.dayCompleted) {
        current += 1;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    return longest;
  }
}

export class MongoFocusRepository implements FocusRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("focuses");
  }

  async findById(id: ObjectId): Promise<Focus | null> {
    const doc = await this.collection().findOne({ _id: id } as JsonDoc);
    return doc ? mapFocus(doc as JsonDoc) : null;
  }

  async listPublished(): Promise<Focus[]> {
    const docs = await this.collection().find({ status: "published" } as JsonDoc).sort({ sortOrder: 1 }).toArray();
    return docs.map((doc) => mapFocus(doc as JsonDoc));
  }
}

export class MongoTagRepository implements TagRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("tags");
  }

  async findById(id: ObjectId): Promise<Tag | null> {
    const doc = await this.collection().findOne({ _id: id } as JsonDoc);
    return doc ? mapTag(doc as JsonDoc) : null;
  }

  async listPublished(): Promise<Tag[]> {
    const docs = await this.collection().find({ status: "published" } as JsonDoc).sort({ name: 1 }).toArray();
    return docs.map((doc) => mapTag(doc as JsonDoc));
  }
}

export class MongoMediaAssetRepository implements MediaAssetRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("media_assets");
  }

  async findById(id: ObjectId): Promise<MediaAsset | null> {
    const doc = await this.collection().findOne({ _id: id } as JsonDoc);
    return doc ? mapMediaAsset(doc as JsonDoc) : null;
  }

  async listByIds(ids: ObjectId[]): Promise<MediaAsset[]> {
    const docs = await this.collection().find({ _id: { $in: ids } } as JsonDoc).toArray();
    return docs.map((doc) => mapMediaAsset(doc as JsonDoc));
  }
}

export class MongoTraditionRepository implements TraditionRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("traditions");
  }

  async findById(id: ObjectId): Promise<Tradition | null> {
    const doc = await this.collection().findOne({ _id: id } as JsonDoc);
    return doc ? mapTradition(doc as JsonDoc) : null;
  }

  async listPublished(): Promise<Tradition[]> {
    const docs = await this.collection().find({ status: "published" } as JsonDoc).sort({ sortOrder: 1 }).toArray();
    return docs.map((doc) => mapTradition(doc as JsonDoc));
  }
}

export const mongoRepositoryIndexDefinitions: Array<{ collection: string; index: Record<string, number>; unique?: boolean }> = [
  { collection: "users", index: { authProvider: 1, authSubject: 1 }, unique: true },
  { collection: "users", index: { status: 1, createdAt: -1 } },
  { collection: "user_preferences", index: { userId: 1 }, unique: true },
  { collection: "traditions", index: { status: 1, sortOrder: 1 } },
  { collection: "focuses", index: { status: 1, sortOrder: 1 } },
  { collection: "focuses", index: { traditionIds: 1, status: 1 } },
  { collection: "tags", index: { status: 1, type: 1 } },
  { collection: "mantras", index: { status: 1, language: 1, createdAt: -1 } },
  { collection: "naam_jap_sessions", index: { userId: 1, clientSessionId: 1 }, unique: true },
  { collection: "naam_jap_sessions", index: { userId: 1, startedAt: -1 } },
  { collection: "naam_jap_sessions", index: { userId: 1, endedAt: -1 } },
  { collection: "meditation_presets", index: { status: 1, sortOrder: 1 } },
  { collection: "meditation_sessions", index: { userId: 1, clientSessionId: 1 }, unique: true },
  { collection: "daily_goals", index: { userId: 1, localDate: 1 }, unique: true },
  { collection: "daily_progress", index: { userId: 1, localDate: 1 }, unique: true },
  { collection: "daily_progress", index: { userId: 1, localDate: -1 } },
  { collection: "daily_progress", index: { userId: 1, dayCompleted: 1, localDate: -1 } },
  { collection: "media_assets", index: { status: 1, type: 1 } },
  { collection: "device_registrations", index: { platform: 1, pushToken: 1 }, unique: true },
];

export async function ensureMongoIndexes(db: Db): Promise<void> {
  for (const entry of mongoRepositoryIndexDefinitions) {
    await db.collection<JsonDoc>(entry.collection).createIndex(entry.index, {
      unique: entry.unique ?? false,
      name: `${entry.collection}_${Object.keys(entry.index).join("_")}`,
    });
  }
}
