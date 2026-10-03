export interface ProgressTodayResponse {
  date: string;
  completed: boolean;
  naam_jap: boolean;
  meditation: boolean;
}

export interface ProgressHistoryResponse {
  month: string;
  items: Array<{ date: string; complete: boolean }>;
}

export interface StreakResponse { current: number; longest: number; }
