import type { Installation } from "../entities/Installation";
import type { InstallationRepository } from "../application/InstallationRepository";

export class InMemoryInstallationRepository implements InstallationRepository {
  private readonly installations = new Map<string, Installation>();

  async findById(installationId: string): Promise<Installation | null> {
    return this.installations.get(installationId) ?? null;
  }

  async save(installation: Installation): Promise<Installation> {
    this.installations.set(installation.installationId, installation);
    return installation;
  }
}
