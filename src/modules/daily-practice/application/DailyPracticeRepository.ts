import type { DailyGoalEntity } from "../entities/DailyGoalEntity";

export interface DailyPracticeRepository {
  get(userId: string, date: string): Promise<DailyGoalEntity | null>;
  save(goal: DailyGoalEntity): Promise<DailyGoalEntity>;
  listByMonth(userId: string, month: string): Promise<DailyGoalEntity[]>;
}
