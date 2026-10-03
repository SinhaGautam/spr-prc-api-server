import type {
  DailyGoalSnapshot,
  Favorite,
  Focus,
  Mantra,
  MediaAsset,
  MeditationPreset,
  MeditationSession,
  NaamJapSession,
  Reading,
  ReadingProgress,
  Song,
  Tag,
  Tradition,
  User,
  UserPreferences,
} from "../domain/entities";
import type { ObjectId, Practice } from "../domain/types";

export interface UserRepository {
  findById(id: ObjectId): Promise<User | null>;
  findByAuth(authProvider: string, authSubject: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
}

export interface UserPreferencesRepository {
  findByUserId(userId: ObjectId): Promise<UserPreferences | null>;
  create(preferences: UserPreferences): Promise<UserPreferences>;
  update(preferences: UserPreferences): Promise<UserPreferences>;
}

export interface CatalogRepository<T> {
  findById(id: ObjectId): Promise<T | null>;
  listPublished(): Promise<T[]>;
}

export interface ReadingRepository extends CatalogRepository<Reading> {
  findByIdWithUserProgress(userId: ObjectId, readingId: ObjectId): Promise<Reading | null>;
  findRecentByUser(userId: ObjectId, limit: number): Promise<ReadingProgress[]>;
}

export interface ReadingProgressRepository {
  findByUserAndReading(userId: ObjectId, readingId: ObjectId): Promise<ReadingProgress | null>;
  upsert(progress: ReadingProgress): Promise<ReadingProgress>;
  listByUser(userId: ObjectId, limit: number): Promise<ReadingProgress[]>;
}

export interface MantraRepository {
  listPublished(): Promise<Mantra[]>;
  findById(id: ObjectId): Promise<Mantra | null>;
}

export interface NaamJapSessionRepository {
  create(session: NaamJapSession): Promise<NaamJapSession>;
  findByClientSessionId(userId: ObjectId, clientSessionId: string): Promise<NaamJapSession | null>;
  listByUser(userId: ObjectId): Promise<NaamJapSession[]>;
}

export interface MeditationPresetRepository {
  listPublished(): Promise<MeditationPreset[]>;
  findById(id: ObjectId): Promise<MeditationPreset | null>;
}

export interface MeditationSessionRepository {
  create(session: MeditationSession): Promise<MeditationSession>;
  findByClientSessionId(userId: ObjectId, clientSessionId: string): Promise<MeditationSession | null>;
  listByUser(userId: ObjectId): Promise<MeditationSession[]>;
}

export interface DailyGoalRepository {
  getForUserAndDate(userId: ObjectId, date: string): Promise<DailyGoalSnapshot | null>;
  save(snapshot: DailyGoalSnapshot): Promise<DailyGoalSnapshot>;
}

export interface DailyProgressRepository {
  getTodayProgress(userId: ObjectId, date: string): Promise<Record<Practice, boolean>>;
  getHistory(userId: ObjectId, month: string): Promise<Array<{ date: string; complete: boolean }>>;
  getCurrentStreak(userId: ObjectId): Promise<number>;
  getLongestStreak(userId: ObjectId): Promise<number>;
}

export interface FocusRepository {
  findById(id: ObjectId): Promise<Focus | null>;
  listPublished(): Promise<Focus[]>;
}

export interface TagRepository {
  findById(id: ObjectId): Promise<Tag | null>;
  listPublished(): Promise<Tag[]>;
}

export interface SongRepository extends CatalogRepository<Song> {
  listByFilters(filters: {
    language?: string;
    tradition?: ObjectId;
    focus?: ObjectId;
    tag?: ObjectId;
    cursor?: string;
  }): Promise<{ items: Song[]; nextCursor: string | null }>;
}

export interface MediaAssetRepository {
  findById(id: ObjectId): Promise<MediaAsset | null>;
  listByIds(ids: ObjectId[]): Promise<MediaAsset[]>;
}

export interface FavoriteRepository {
  listByUser(userId: ObjectId): Promise<Favorite[]>;
  add(favorite: Favorite): Promise<Favorite>;
  remove(userId: ObjectId, entityType: Favorite["entityType"], entityId: ObjectId): Promise<void>;
}

export type TraditionRepository = CatalogRepository<Tradition>;
