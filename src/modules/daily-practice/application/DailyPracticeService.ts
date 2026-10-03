import { BaseApiService } from "../../../core/application/BaseApiService";
import { DailyGoalEntity } from "../entities/DailyGoalEntity";
import type { DailyPracticeRepository } from "./DailyPracticeRepository";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export class DailyPracticeService extends BaseApiService {
  constructor(private readonly repository: DailyPracticeRepository) { super(); }

  async getGoalsToday(userId: string) {
    return this.execute("dailyPractice.getGoalsToday", async () => {
      const date = today();
      const existing = await this.repository.get(userId, date);
      const goal = existing ?? await this.repository.save(
        new DailyGoalEntity(userId, date, ["naam_jap", "meditation"], 108, 15),
      );
      return {
        date: goal.date,
        enabledPractices: goal.enabledPractices,
        goals: [
          { practice: "naam_jap" as const, target: `${goal.naamJapTarget} repetitions`, progress: goal.naamJapProgress, complete: goal.naamJapComplete },
          { practice: "meditation" as const, target: `${goal.meditationTargetMinutes} minutes`, progress: goal.meditationProgressMinutes, complete: goal.meditationComplete },
        ],
        allComplete: goal.allComplete,
      };
    }, { userId });
  }

  async getProgressToday(userId: string) {
    return this.execute("dailyPractice.getProgressToday", async () => {
      const date = today();
      const goal = await this.repository.get(userId, date);
      return {
        date,
        completed: goal?.allComplete ?? false,
        breakdown: {
          naam_jap: goal?.naamJapComplete ?? false,
          meditation: goal?.meditationComplete ?? false,
        },
      };
    }, { userId });
  }

  async getHistory(userId: string, month?: string) {
    return this.execute("dailyPractice.getHistory", async () => {
      const resolvedMonth = month ?? today().slice(0, 7);
      const items = await this.repository.listByMonth(userId, resolvedMonth);
      return { month: resolvedMonth, items: items.map((item) => ({ date: item.date, complete: item.allComplete })) };
    }, { userId, month });
  }

  async getStreak(userId: string) {
    return this.execute("dailyPractice.getStreak", async () => {
      const currentDate = today();
      const currentMonth = currentDate.slice(0, 7);
      const items = await this.repository.listByMonth(userId, currentMonth);
      const completeDates = new Set(items.filter((item) => item.allComplete).map((item) => item.date));
      let current = 0;
      const cursor = new Date(currentDate);
      while (completeDates.has(cursor.toISOString().slice(0, 10))) {
        current += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }
      return { current, longest: current };
    }, { userId });
  }
}
