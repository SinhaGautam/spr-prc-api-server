import { BaseApiService } from "../../../core/application/BaseApiService";
import { getDatabase } from "../../../infrastructure/mongodb/MongoDatabase";

export class HealthService extends BaseApiService {
  async getLive() {
    return this.execute("health.live", async () => ({ status: "ok" as const }));
  }

  async getReady() {
    return this.execute("health.ready", async () => {
      const mongo = getDatabase();
      return {
        status: mongo ? ("ready" as const) : ("degraded" as const),
        checks: { api: "ok" as const, mongo: mongo ? ("ok" as const) : ("not_configured" as const) },
      };
    });
  }
}
