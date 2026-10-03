import { logger } from "../../../lib/logger";

export class ProgressService {
  async getToday(userId: string) {
    try {
      const date = new Date().toISOString();
      return {
        date,
        completed: false,
        goals: [
          { practice: "naam_jap", complete: false },
          { practice: "meditation", complete: true },
        ],
      };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to resolve today progress");
      throw error;
    }
  }

  async getHistory(userId: string, month?: string) {
    try {
      return {
        month: month ?? "2026-09",
        items: [
          { date: "2026-09-08", complete: true },
          { date: "2026-09-09", complete: false },
        ],
      };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to resolve progress history");
      throw error;
    }
  }

  async getStreak(userId: string) {
    try {
      return { current: 2, longest: 5 };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to resolve streak");
      throw error;
    }
  }
}
