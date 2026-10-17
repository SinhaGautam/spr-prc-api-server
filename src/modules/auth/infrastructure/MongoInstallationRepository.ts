import type { Db } from "mongodb";
import type { Installation } from "../entities/Installation";
import type { InstallationRepository } from "../application/InstallationRepository";

export class MongoInstallationRepository implements InstallationRepository {
  constructor(private readonly db: Db) {}

  async findById(installationId: string): Promise<Installation | null> {
    const doc = await this.db.collection<Installation>("installations").findOne({ installationId });
    return doc ?? null;
  }

  async save(installation: Installation): Promise<Installation> {
    await this.db.collection<Installation>("installations").updateOne(
      { installationId: installation.installationId },
      { $set: {
        secretHash: installation.secretHash,
        userId: installation.userId,
        platform: installation.platform,
        appVersion: installation.appVersion,
        osVersion: installation.osVersion,
        deviceModel: installation.deviceModel,
        language: installation.language,
        timezone: installation.timezone,
        updatedAt: installation.updatedAt,
        lastSeenAt: installation.lastSeenAt,
      }, $setOnInsert: { createdAt: installation.createdAt } },
      { upsert: true },
    );
    return installation;
  }
}
