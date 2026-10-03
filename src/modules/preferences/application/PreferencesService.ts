import { BaseApiService } from "../../../core/application/BaseApiService";
import type { UpdatePreferencesRequest } from "../contracts/PreferencesRequest";
import { UserPreferencesEntity } from "../entities/UserPreferencesEntity";
import type { PreferencesRepository } from "./PreferencesRepository";

const defaults = {
  traditionId: "trad-hindu",
  enabledPractices: ["naam_jap", "meditation"] as Array<"naam_jap" | "meditation">,
  language: "en",
  reminder: { enabled: false, localTime: "07:00" },
};

export class PreferencesService extends BaseApiService {
  constructor(private readonly repository: PreferencesRepository) { super(); }

  async getPreferences(userId: string) {
    return this.execute("preferences.get", async () => {
      const current = await this.repository.findByUserId(userId);
      return this.toResponse(userId, current ?? new UserPreferencesEntity(
        `preferences-${userId}`, userId, defaults.traditionId, defaults.enabledPractices,
        defaults.language, defaults.reminder,
      ));
    }, { userId });
  }

  async updatePreferences(userId: string, request: UpdatePreferencesRequest) {
    return this.execute("preferences.update", async () => {
      const current = await this.repository.findByUserId(userId);
      const entity = new UserPreferencesEntity(
        current?._id ?? `preferences-${userId}`,
        userId,
        request.traditionId,
        request.enabledPractices,
        current?.language ?? defaults.language,
        request.reminder ?? current?.reminder ?? defaults.reminder,
        request.primaryFocusId,
        request.naamJapTarget ? { repetitions: request.naamJapTarget } : current?.naamJapTarget,
        request.meditationTargetMinutes ? { minutes: request.meditationTargetMinutes } : current?.meditationTarget,
        current?.createdAt,
        new Date(),
      );
      const saved = await this.repository.save(entity);
      return this.toResponse(userId, saved);
    }, { userId });
  }

  private toResponse(userId: string, value: UserPreferencesEntity) {
    return {
      userId,
      traditionId: value.traditionId,
      primaryFocusId: value.primaryFocusId,
      enabledPractices: value.enabledPractices,
      naamJapTarget: value.naamJapTarget?.repetitions,
      meditationTargetMinutes: value.meditationTarget?.minutes,
      reminder: value.reminder,
    };
  }
}
