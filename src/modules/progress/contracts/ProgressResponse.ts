export interface ProgressTodayResponse {
  date: string;
  completed: boolean;
  goals: Array<{ practice: "naam_jap" | "meditation"; complete: boolean }>;
}

export interface ProgressHistoryResponse {
  month: string;
  items: Array<{ date: string; complete: boolean }>;
}

export interface StreakResponse { current: number; longest: number; }
