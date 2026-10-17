import { BaseApiService } from "../../../core/application/BaseApiService";
import type { UpdatePreferencesRequest } from "../contracts/PreferencesRequest";
import { UserPreferencesEntity } from "../entities/UserPreferencesEntity";
import type { PreferencesRepository } from "./PreferencesRepository";
import type { FeatureAvailabilityService } from "../../features/application/FeatureAvailabilityService";

const defaults = {
  traditionId: "trad-hindu",
  enabledPractices: ["naam_jap", "meditation"] as Array<"naam_jap" | "meditation">,
  language: "en",
  reminder: { enabled: false, localTime: "07:00" },
};

const featureKeys = {
  naam_jap: "spr-naamjaap-enabled",
  meditation: "spr-meditation-enabled",
} as const;

export class PreferencesService extends BaseApiService {
  constructor(
    private readonly repository: PreferencesRepository,
    private readonly featureAvailability: FeatureAvailabilityService,
  ) { super(); }

  async getPreferences(userId: string) {
    return this.execute("preferences.get", async () => {
      const current = await this.repository.findByUserId(userId);
      const source = current ?? new UserPreferencesEntity(
        `preferences-${userId}`, userId, defaults.traditionId, defaults.enabledPractices,
        defaults.language, defaults.reminder,
      );
      const availability = await Promise.all([
        this.featureAvailability.isActive(featureKeys.naam_jap),
        this.featureAvailability.isActive(featureKeys.meditation),
      ]);
      const enabledPractices = source.enabledPractices.filter((practice) =>
        practice === "naam_jap" ? availability[0] : availability[1]);
      return this.toResponse(userId, source, enabledPractices);
    }, { userId });
  }

  async updatePreferences(userId: string, request: UpdatePreferencesRequest) {
    return this.execute("preferences.update", async () => {
      for (const practice of request.enabledPractices) {
        await this.featureAvailability.requireActive(featureKeys[practice], practice === "naam_jap" ? "Naam Jap" : "Meditation");
      }
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
      return this.toResponse(userId, saved, saved.enabledPractices);
    }, { userId });
  }

  private toResponse(userId: string, value: UserPreferencesEntity, enabledPractices = value.enabledPractices) {
    return {
      userId,
      traditionId: value.traditionId,
      primaryFocusId: value.primaryFocusId,
      enabledPractices,
      naamJapTarget: value.naamJapTarget?.repetitions,
      meditationTargetMinutes: value.meditationTarget?.minutes,
      reminder: value.reminder,
    };
  }
}
