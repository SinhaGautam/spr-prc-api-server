export class MeditationSessionEntity {
  constructor(
    public readonly _id: string,
    public readonly userId: string,
    public readonly plannedMinutes: number,
    public readonly actualSeconds: number,
    public readonly startedAt: Date,
    public readonly completed: boolean,
    public readonly clientSessionId: string,
    public readonly presetId?: string,
    public readonly endedAt?: Date,
    public readonly completionReason?: "completed" | "interrupted" | "cancelled",
    public readonly createdAt: Date = new Date(),
  ) {}
}
