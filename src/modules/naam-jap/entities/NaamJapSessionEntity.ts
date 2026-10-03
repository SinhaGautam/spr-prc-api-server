export class NaamJapSessionEntity {
  constructor(
    public readonly _id: string,
    public readonly userId: string,
    public readonly targetRepetitions: number,
    public readonly completedRepetitions: number,
    public readonly startedAt: Date,
    public readonly durationSeconds: number,
    public readonly completed: boolean,
    public readonly clientSessionId: string,
    public readonly mantraId?: string,
    public readonly mantraTextSnapshot?: string,
    public readonly endedAt?: Date,
    public readonly createdAt: Date = new Date(),
  ) {}
}
