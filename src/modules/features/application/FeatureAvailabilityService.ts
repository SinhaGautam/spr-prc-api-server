import { ConflictError, DependencyError } from "../../../lib/errors";
import type { FeaturesRepository } from "./FeaturesRepository";

/**
 * Server-authoritative feature availability policy.
 * Missing flags fail closed: an absent feature record is never treated as enabled.
 */
export class FeatureAvailabilityService {
  constructor(private readonly repository: FeaturesRepository) {}

  async isActive(key: string): Promise<boolean> {
    try {
      const features = await this.repository.listAll();
      const feature = features.find((item) => item.key === key);
      return feature?.isActive === true;
    } catch {
      throw new DependencyError("Feature availability could not be determined");
    }
  }

  async requireActive(key: string, featureName: string): Promise<void> {
    if (!(await this.isActive(key))) {
      throw new ConflictError(`FEATURE_DISABLED: ${featureName} is currently unavailable`);
    }
  }
}
