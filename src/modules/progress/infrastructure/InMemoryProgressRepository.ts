import type { ProgressRepository } from "../application/ProgressRepository";

export class InMemoryProgressRepository implements ProgressRepository {
  async getToday(_userId: string, date: string) {
    return { naam_jap: false, meditation: false, completed: false, date };
  }

  async getHistory(_userId: string, month: string) {
    return { month, items: [] };
  }

  async getStreak(_userId: string) {
    return { current: 0, longest: 0 };
  }
}
