import type { FeatureEntity } from "../entities/FeatureEntity";

export interface FeaturesRepository {
  listAll(): Promise<FeatureEntity[]>;
}
