import type { Db } from "mongodb";
import type { Installation } from "../entities/Installation";
import type { InstallationRepository } from "../application/InstallationRepository";

export class MongoInstallationRepository implements InstallationRepository {
  constructor(private readonly db: Db) {}

  async findById(installationId: string): Promise<Installation | null> {
    const doc = await this.db.collection<Installation>("installations").findOne({ installationId });
    return doc ?? null;
  }

  async create(installation: Installation): Promise<Installation> {
    await this.db.collection<Installation>("installations").insertOne(installation);
    return installation;
  }

  async update(installation: Installation): Promise<Installation> {
    const result = await this.db.collection<Installation>("installations").updateOne(
      { installationId: installation.installationId, userId: installation.userId },
      { $set: {
        platform: installation.platform,
        appVersion: installation.appVersion,
        osVersion: installation.osVersion,
        deviceModel: installation.deviceModel,
        language: installation.language,
        timezone: installation.timezone,
        updatedAt: installation.updatedAt,
        lastSeenAt: installation.lastSeenAt,
      } },
    );
    if (result.matchedCount === 0) throw new Error("Installation was not found for update");
    return installation;
  }
}
