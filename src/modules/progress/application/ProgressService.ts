import { BaseApiService } from "../../../core/application/BaseApiService";
import type { ProgressRepository } from "./ProgressRepository";

export class ProgressService extends BaseApiService {
  constructor(private readonly repository: ProgressRepository) { super(); }

  async getToday(userId: string) {
    return this.execute("progress.getToday", () => this.repository.getToday(userId, new Date().toISOString().slice(0, 10)), { userId });
  }

  async getHistory(userId: string, month?: string) {
    return this.execute("progress.getHistory", () => this.repository.getHistory(userId, month ?? new Date().toISOString().slice(0, 7)), { userId, month });
  }

  async getStreak(userId: string) {
    return this.execute("progress.getStreak", () => this.repository.getStreak(userId), { userId });
  }
}
