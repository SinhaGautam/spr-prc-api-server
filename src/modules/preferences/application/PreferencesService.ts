import { logger } from "../../../lib/logger";

type PreferencePayload = {
  traditionId: string;
  primaryFocusId?: string;
  enabledPractices: Array<"reading" | "naam_jap" | "meditation">;
  naamJapTarget?: number;
  meditationTargetMinutes?: number;
  reminder?: {
    enabled: boolean;
    localTime?: string;
  };
};

const preferencesStore = new Map<string, PreferencePayload>();

const defaultPreferences: PreferencePayload = {
  traditionId: "trad-hindu",
  enabledPractices: ["reading", "naam_jap", "meditation"],
  reminder: { enabled: false, localTime: "07:00" },
};

export class PreferencesService {
  async getPreferences(userId: string) {
    try {
      return preferencesStore.get(userId) ?? defaultPreferences;
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to load preferences");
      throw error;
    }
  }

  async updatePreferences(userId: string, payload: PreferencePayload) {
    try {
      const normalized = {
        ...defaultPreferences,
        ...payload,
        reminder: payload.reminder ?? defaultPreferences.reminder,
        enabledPractices: payload.enabledPractices,
      };

      preferencesStore.set(userId, normalized);
      logger.info({ userId, enabledPractices: normalized.enabledPractices }, "User preferences updated");
      return normalized;
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to update preferences");
      throw error;
    }
  }
}
