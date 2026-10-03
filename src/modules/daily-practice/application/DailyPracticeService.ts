import { BaseApiService } from "../../../core/application/BaseApiService";
import type { PreferencesService } from "../../preferences/application/PreferencesService";
import { DailyGoalEntity } from "../entities/DailyGoalEntity";
import type { DailyPracticeRepository } from "./DailyPracticeRepository";
import type { PracticeCompletionPort } from "./PracticeCompletionPort";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export class DailyPracticeService extends BaseApiService implements PracticeCompletionPort {
  constructor(
    private readonly repository: DailyPracticeRepository,
    private readonly preferencesService: PreferencesService,
  ) { super(); }

  async getGoalsToday(userId: string) {
    return this.execute("dailyPractice.getGoalsToday", async () => {
      const goal = await this.getOrCreateToday(userId);
      return {
        date: goal.date,
        enabledPractices: goal.enabledPractices,
        goals: [
          { practice: "naam_jap" as const, target: `${goal.naamJapTarget} repetitions`, progress: goal.naamJapProgress, complete: goal.naamJapComplete },
          { practice: "meditation" as const, target: `${goal.meditationTargetMinutes} minutes`, progress: goal.meditationProgressMinutes, complete: goal.meditationComplete },
        ].filter((item) => goal.enabledPractices.includes(item.practice)),
        allComplete: goal.allComplete,
      };
    }, { userId });
  }

  async getProgressToday(userId: string) {
    return this.execute("dailyPractice.getProgressToday", async () => {
      const goal = await this.repository.get(userId, today());
      return {
        date: today(),
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
      const items = await this.repository.listByMonth(userId, today().slice(0, 7));
      const completeDates = new Set(items.filter((item) => item.allComplete).map((item) => item.date));
      let current = 0;
      const cursor = new Date(today());
      while (completeDates.has(cursor.toISOString().slice(0, 10))) {
        current += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }
      return { current, longest: current };
    }, { userId });
  }

  async recordNaamJapCompletion(userId: string, repetitions: number): Promise<void> {
    if (repetitions <= 0) return;
    const goal = await this.getOrCreateToday(userId);
    if (!goal.enabledPractices.includes("naam_jap")) return;
    const updated = new DailyGoalEntity(
      goal.userId, goal.date, goal.enabledPractices, goal.naamJapTarget, goal.meditationTargetMinutes,
      Math.min(goal.naamJapTarget, goal.naamJapProgress + repetitions), goal.meditationProgressMinutes,
    );
    await this.repository.save(updated);
  }

  async recordMeditationCompletion(userId: string, minutes: number): Promise<void> {
    if (minutes <= 0) return;
    const goal = await this.getOrCreateToday(userId);
    if (!goal.enabledPractices.includes("meditation")) return;
    const updated = new DailyGoalEntity(
      goal.userId, goal.date, goal.enabledPractices, goal.naamJapTarget, goal.meditationTargetMinutes,
      goal.naamJapProgress, Math.min(goal.meditationTargetMinutes, goal.meditationProgressMinutes + minutes),
    );
    await this.repository.save(updated);
  }

  private async getOrCreateToday(userId: string): Promise<DailyGoalEntity> {
    const date = today();
    const existing = await this.repository.get(userId, date);
    if (existing) return existing;

    const preferences = await this.preferencesService.getPreferences(userId);
    const goal = new DailyGoalEntity(
      userId,
      date,
      preferences.enabledPractices,
      preferences.naamJapTarget ?? 108,
      preferences.meditationTargetMinutes ?? 15,
    );
    return this.repository.save(goal);
  }
}
