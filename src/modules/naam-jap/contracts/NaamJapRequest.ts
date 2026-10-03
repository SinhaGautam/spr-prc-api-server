export interface CreateNaamJapSessionRequest {
  mantraId?: string;
  mantraText?: string;
  targetRepetitions: number;
  completedRepetitions: number;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  completed: boolean;
  clientSessionId: string;
}
