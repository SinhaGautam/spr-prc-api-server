export interface MantraResponse { id: string; name: string; text: string; language: string; }
export interface NaamJapSessionResponse {
  id: string;
  userId: string;
  targetRepetitions: number;
  completedRepetitions: number;
  startedAt: string;
  durationSeconds: number;
  completed: boolean;
  clientSessionId: string;
  createdAt: string;
  mantraId?: string;
  mantraTextSnapshot?: string;
  endedAt?: string;
  idempotent?: boolean;
}
