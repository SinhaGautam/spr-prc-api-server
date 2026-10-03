export interface CreateMeditationSessionRequest {
  presetId?: string;
  plannedMinutes: number;
  actualSeconds: number;
  startedAt: string;
  endedAt?: string;
  completed: boolean;
  completionReason?: "completed" | "interrupted" | "cancelled";
  clientSessionId: string;
}
