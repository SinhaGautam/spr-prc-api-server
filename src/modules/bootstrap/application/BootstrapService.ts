import { BaseApiService } from "../../../core/application/BaseApiService";
import type { ContentService } from "../../content/application/ContentService";
import type { MeditationService } from "../../meditation/application/MeditationService";

export class BootstrapService extends BaseApiService {
  constructor(
    private readonly contentService: ContentService,
    private readonly meditationService: MeditationService,
  ) { super(); }

  async getBootstrapData() {
    return this.execute("bootstrap.getBootstrapData", async () => {
      const catalog = await this.contentService.getCatalog();
      const presets = await this.meditationService.listPresets();
      return {
        traditions: catalog.traditions,
        focuses: catalog.focuses,
        practices: ["naam_jap", "meditation"] as ["naam_jap", "meditation"],
        meditationPresets: presets.items,
        languages: ["en", "hi"],
        reminderDefaults: { enabled: false, localTime: "07:00" },
      };
    });
  }
}
