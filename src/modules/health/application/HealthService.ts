import { getDatabase } from "../../../infrastructure/mongodb/MongoDatabase";

export class HealthService {
  async getLive() { return { status: "ok" as const }; }

  async getReady() {
    const mongo = getDatabase();
    return {
      status: mongo ? ("ready" as const) : ("degraded" as const),
      checks: { api: "ok" as const, mongo: mongo ? ("ok" as const) : ("not_configured" as const) },
    };
  }
}
