export interface PracticeCompletionPort {
  recordNaamJapCompletion(userId: string, repetitions: number): Promise<void>;
  recordMeditationCompletion(userId: string, minutes: number): Promise<void>;
}
