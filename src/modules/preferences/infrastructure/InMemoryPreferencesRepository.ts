import type { PreferencesRepository } from "../application/PreferencesRepository";
import type { UserPreferencesEntity } from "../entities/UserPreferencesEntity";

export class InMemoryPreferencesRepository implements PreferencesRepository {
  private readonly store = new Map<string, UserPreferencesEntity>();

  async findByUserId(userId: string): Promise<UserPreferencesEntity | null> {
    return this.store.get(userId) ?? null;
  }

  async save(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity> {
    this.store.set(preferences.userId, preferences);
    return preferences;
  }
}
