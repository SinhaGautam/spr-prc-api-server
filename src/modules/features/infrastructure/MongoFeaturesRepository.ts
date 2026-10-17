import type { Db } from "mongodb";
import type { FeaturesRepository } from "../application/FeaturesRepository";
import type { FeatureEntity } from "../entities/FeatureEntity";

type FeatureDocument = {
  _id: unknown;
  key?: unknown;
  isActive?: unknown;
  description?: unknown;
  sortOrder?: unknown;
};

export class MongoFeaturesRepository implements FeaturesRepository {
  constructor(private readonly db: Db) {}

  async listAll(): Promise<FeatureEntity[]> {
    const documents = await this.db
      .collection<FeatureDocument>("features")
      .find({})
      .sort({ sortOrder: 1, key: 1 })
      .toArray();

    return documents.map((document) => {
      if (typeof document.key !== "string" || typeof document.isActive !== "boolean") {
        throw new Error("Invalid feature document: key and isActive are required");
      }

      return {
        id: String(document._id),
        key: document.key,
        isActive: document.isActive,
        ...(typeof document.description === "string" ? { description: document.description } : {}),
        sortOrder: typeof document.sortOrder === "number" ? document.sortOrder : 0,
      };
    });
  }
}
