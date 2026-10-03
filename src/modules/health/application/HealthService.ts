import { logger } from "../../../lib/logger";

export class HealthService {
  async getLive() {
    try {
      return { status: "ok" };
    } catch (error) {
      logger.error({ err: error }, "Failed to report live health");
      throw error;
    }
  }

  async getReady() {
    try {
      return {
        status: "ready",
        checks: {
          api: "ok",
          mongo: "not_configured",
          objectStorage: "not_configured",
        },
      };
    } catch (error) {
      logger.error({ err: error }, "Failed to report ready health");
      throw error;
    }
  }
}
