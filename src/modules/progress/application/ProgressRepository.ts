export interface ProgressRepository {
  getToday(userId: string, date: string): Promise<{ naam_jap: boolean; meditation: boolean; completed: boolean; date?: string }>;
  getHistory(userId: string, month: string): Promise<{ month: string; items: Array<{ date: string; complete: boolean }> }>;
  getStreak(userId: string): Promise<{ current: number; longest: number }>;
}
