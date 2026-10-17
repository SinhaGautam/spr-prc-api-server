import { BaseApiService } from "../../../core/application/BaseApiService";
import type { ContentService } from "../../content/application/ContentService";
import type { MeditationService } from "../../meditation/application/MeditationService";
import type { NaamJapService } from "../../naam-jap/application/NaamJapService";

export class BootstrapService extends BaseApiService {
  constructor(
    private readonly contentService: ContentService,
    private readonly meditationService: MeditationService,
    private readonly naamJapService: NaamJapService,
  ) { super(); }

  async getBootstrapData() {
    return this.execute("bootstrap.getBootstrapData", async () => {
      const [catalog, meditationEnabled, naamJapEnabled] = await Promise.all([
        this.contentService.getCatalog(),
        this.meditationService.isEnabled(),
        this.naamJapService.isEnabled(),
      ]);
      const presets = meditationEnabled ? await this.meditationService.listPresets() : { items: [] };
      const practices: Array<"naam_jap" | "meditation"> = [
        ...(naamJapEnabled ? ["naam_jap" as const] : []),
        ...(meditationEnabled ? ["meditation" as const] : []),
      ];
      return {
        traditions: catalog.traditions,
        focuses: catalog.focuses,
        practices,
        meditationPresets: presets.items,
        languages: ["en", "hi"],
        reminderDefaults: { enabled: false, localTime: "07:00" },
      };
    });
  }
}
