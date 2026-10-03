import type { UserPreferencesEntity } from "../entities/UserPreferencesEntity";

export interface PreferencesRepository {
  findByUserId(userId: string): Promise<UserPreferencesEntity | null>;
  save(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity>;
}
