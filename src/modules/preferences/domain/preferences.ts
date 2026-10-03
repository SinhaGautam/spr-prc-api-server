import type { UserPreferencesEntity } from "../entities/UserPreferencesEntity";

export type UserPreferences = UserPreferencesEntity;

export const defaultEnabledPractices = ["naam_jap", "meditation"] as const;
