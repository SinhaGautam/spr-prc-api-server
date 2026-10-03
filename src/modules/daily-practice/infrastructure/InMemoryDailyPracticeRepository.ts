import type { DailyPracticeRepository } from "../application/DailyPracticeRepository";
import type { DailyGoalEntity } from "../entities/DailyGoalEntity";

export class InMemoryDailyPracticeRepository implements DailyPracticeRepository {
  private readonly store = new Map<string, DailyGoalEntity>();

  async get(userId: string, date: string): Promise<DailyGoalEntity | null> {
    return this.store.get(`${userId}:${date}`) ?? null;
  }

  async save(goal: DailyGoalEntity): Promise<DailyGoalEntity> {
    this.store.set(`${goal.userId}:${goal.date}`, goal);
    return goal;
  }

  async listByMonth(userId: string, month: string): Promise<DailyGoalEntity[]> {
    return [...this.store.values()].filter((item) => item.userId === userId && item.date.startsWith(month));
  }
}
