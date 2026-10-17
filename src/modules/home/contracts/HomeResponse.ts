export interface HomeTodayResponse {
  greeting: string;
  dailyGoals: Array<{ practice: "naam_jap" | "meditation"; targetLabel: string; progress: number; complete: boolean }>;
  defaultMantra: { id: string; name: string; text: string } | null;
  meditationPreset: { id: string; durationMinutes: number; key?: string } | null;
}
