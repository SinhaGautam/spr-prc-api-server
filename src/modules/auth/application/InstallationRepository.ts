import type { Installation } from "../entities/Installation";

export interface InstallationRepository {
  findById(installationId: string): Promise<Installation | null>;
  create(installation: Installation): Promise<Installation>;
  update(installation: Installation): Promise<Installation>;
}
