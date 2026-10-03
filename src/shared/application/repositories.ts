import type { DailyGoalSnapshotEntity } from "../../modules/daily-practice/entities/DailyGoalSnapshotEntity";
import type { FocusEntity } from "../../modules/content/entities/FocusEntity";
import type { MantraEntity } from "../../modules/naam-jap/entities/MantraEntity";
import type { MediaAssetEntity } from "../../modules/content/entities/MediaAssetEntity";
import type { MeditationPresetEntity } from "../../modules/meditation/entities/MeditationPresetEntity";
import type { MeditationSessionEntity } from "../../modules/meditation/entities/MeditationSessionEntity";
import type { NaamJapSessionEntity } from "../../modules/naam-jap/entities/NaamJapSessionEntity";
import type { TagEntity } from "../../modules/content/entities/TagEntity";
import type { TraditionEntity } from "../../modules/content/entities/TraditionEntity";
import type { UserEntity } from "../../modules/users/entities/UserEntity";
import type { UserPreferencesEntity } from "../../modules/preferences/entities/UserPreferencesEntity";
import type { IRepository, IReadRepository } from "./IRepository";
import type { ObjectId, Practice } from "../domain/types";

export interface UserRepository extends IRepository<UserEntity, ObjectId> {
  findByAuth(authProvider: string, authSubject: string): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<UserEntity>;
}

export interface UserPreferencesRepository extends IRepository<UserPreferencesEntity, ObjectId> {
  findByUserId(userId: ObjectId): Promise<UserPreferencesEntity | null>;
  update(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity>;
}

export interface CatalogRepository<TEntity> extends IReadRepository<TEntity, ObjectId> {
  listPublished(): Promise<TEntity[]>;
}

export interface MantraRepository extends IReadRepository<MantraEntity, ObjectId> {
  listPublished(): Promise<MantraEntity[]>;
}

export interface NaamJapSessionRepository extends IRepository<NaamJapSessionEntity, ObjectId> {
  findByClientSessionId(userId: ObjectId, clientSessionId: string): Promise<NaamJapSessionEntity | null>;
  listByUser(userId: ObjectId): Promise<NaamJapSessionEntity[]>;
}

export interface MeditationPresetRepository extends IReadRepository<MeditationPresetEntity, ObjectId> {
  listPublished(): Promise<MeditationPresetEntity[]>;
}

export interface MeditationSessionRepository extends IRepository<MeditationSessionEntity, ObjectId> {
  findByClientSessionId(userId: ObjectId, clientSessionId: string): Promise<MeditationSessionEntity | null>;
  listByUser(userId: ObjectId): Promise<MeditationSessionEntity[]>;
}

export interface DailyGoalRepository {
  getForUserAndDate(userId: ObjectId, date: string): Promise<DailyGoalSnapshotEntity | null>;
  save(snapshot: DailyGoalSnapshotEntity): Promise<DailyGoalSnapshotEntity>;
}

export interface DailyProgressRepository {
  getTodayProgress(userId: ObjectId, date: string): Promise<Record<Practice, boolean>>;
  getHistory(userId: ObjectId, month: string): Promise<Array<{ date: string; complete: boolean }>>;
  getCurrentStreak(userId: ObjectId): Promise<number>;
  getLongestStreak(userId: ObjectId): Promise<number>;
}

export interface FocusRepository extends IReadRepository<FocusEntity, ObjectId> {
  listPublished(): Promise<FocusEntity[]>;
}

export interface TagRepository extends IReadRepository<TagEntity, ObjectId> {
  listPublished(): Promise<TagEntity[]>;
}

export interface MediaAssetRepository extends IReadRepository<MediaAssetEntity, ObjectId> {
  listByIds(ids: ObjectId[]): Promise<MediaAssetEntity[]>;
}

export type TraditionRepository = CatalogRepository<TraditionEntity>;
