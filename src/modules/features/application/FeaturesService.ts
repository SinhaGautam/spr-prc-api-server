import { BaseApiService } from "../../../core/application/BaseApiService";
import type { FeaturesResponse } from "../schemas";
import type { FeaturesRepository } from "./FeaturesRepository";

export class FeaturesService extends BaseApiService {
  constructor(private readonly repository: FeaturesRepository) {
    super();
  }

  async getFeatures(): Promise<FeaturesResponse> {
    return this.execute("features.list", async () => {
      const features = await this.repository.listAll();
      return {
        features: features.map(({ key, isActive }) => ({ key, isActive })),
      };
    });
  }
}
