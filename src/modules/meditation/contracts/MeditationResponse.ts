export interface MeditationPresetResponse {
  id: string;
  key: string;
  durationMinutes: number;
}

export interface MeditationSessionResponse {
  id: string;
  userId: string;
  plannedMinutes: number;
  actualSeconds: number;
  startedAt: string;
  endedAt?: string;
  completed: boolean;
  completionReason?: "completed" | "interrupted" | "cancelled";
  clientSessionId: string;
  idempotent?: boolean;
}
