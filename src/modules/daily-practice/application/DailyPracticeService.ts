import { logger } from "../../../lib/logger";

const goalsStore = new Map<string, { date: string; enabledPractices: Array<"reading" | "naam_jap" | "meditation">; goals: Array<{ practice: "reading" | "naam_jap" | "meditation"; target: string; progress: number; complete: boolean }>; allComplete: boolean }>();

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export class DailyPracticeService {
  async getGoalsToday(userId: string) {
    try {
      const today = getTodayKey();
      const payload = goalsStore.get(`${userId}:${today}`) ?? {
        date: today,
        enabledPractices: ["reading", "naam_jap", "meditation"],
        goals: [
          { practice: "reading", target: "1 reading", progress: 0, complete: false },
          { practice: "naam_jap", target: "108 repetitions", progress: 32, complete: false },
          { practice: "meditation", target: "15 minutes", progress: 15, complete: true },
        ],
        allComplete: false,
      };

      logger.debug({ userId, date: today }, "Resolved daily goals");
      return payload;
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to resolve daily goals");
      throw error;
    }
  }

  async getProgressToday(userId: string) {
    try {
      const date = getTodayKey();
      const payload = {
        date,
        completed: false,
        breakdown: { reading: false, naam_jap: false, meditation: true },
      };

      logger.debug({ userId, date }, "Resolved daily progress");
      return payload;
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to resolve daily progress");
      throw error;
    }
  }

  async getHistory(userId: string, month?: string) {
    try {
      const resolvedMonth = month ?? new Date().toISOString().slice(0, 7);
      return {
        month: resolvedMonth,
        items: [
          { date: `${resolvedMonth}-08`, complete: true },
          { date: `${resolvedMonth}-09`, complete: false },
        ],
      };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to resolve daily history");
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
