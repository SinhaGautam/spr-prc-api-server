export interface CreateNaamJapSessionRequest {
  targetRepetitions: number;
  completedRepetitions: number;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  completed: boolean;
  clientSessionId: string;
}
