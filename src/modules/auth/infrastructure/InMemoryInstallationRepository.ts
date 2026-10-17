import { ConflictError } from "../../../lib/errors";
import type { Installation } from "../entities/Installation";
import type { InstallationRepository } from "../application/InstallationRepository";

export class InMemoryInstallationRepository implements InstallationRepository {
  private readonly installations = new Map<string, Installation>();

  async findById(installationId: string): Promise<Installation | null> {
    return this.installations.get(installationId) ?? null;
  }

  async create(installation: Installation): Promise<Installation> {
    if (this.installations.has(installation.installationId)) {
      throw new ConflictError("Installation is already registered");
    }
    this.installations.set(installation.installationId, installation);
    return installation;
  }

  async update(installation: Installation): Promise<Installation> {
    if (!this.installations.has(installation.installationId)) {
      throw new ConflictError("Installation is not registered");
    }
    this.installations.set(installation.installationId, installation);
    return installation;
  }
}
