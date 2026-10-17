import { BaseApiService } from "../../../core/application/BaseApiService";
import type { FeaturesResponse } from "../schemas";

const V1_ENABLED_FEATURES = [
  "spr-naamjaap-enabled",
  "spr-meditation-enabled",
] as const;

export class FeaturesService extends BaseApiService {
  async getEnabledFeatures(): Promise<FeaturesResponse> {
    return this.execute("features.list", async () => ({
      features: [...V1_ENABLED_FEATURES],
    }));
  }
}
