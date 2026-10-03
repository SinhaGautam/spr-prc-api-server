export interface DailyGoalsResponse {
  date: string;
  enabledPractices: Array<"naam_jap" | "meditation">;
  goals: Array<{ practice: "naam_jap" | "meditation"; target: string; progress: number; complete: boolean }>;
  allComplete: boolean;
}

export interface DailyProgressResponse {
  date: string;
  completed: boolean;
  breakdown: { naam_jap: boolean; meditation: boolean };
}
