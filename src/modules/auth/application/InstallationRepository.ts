import type { Installation } from "../entities/Installation";

export interface InstallationRepository {
  findById(installationId: string): Promise<Installation | null>;
  save(installation: Installation): Promise<Installation>;
}
