export class MantraResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly text: string,
    public readonly language: string,
  ) {}
}

export class NaamJapSessionResponse {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetRepetitions: number,
    public readonly completedRepetitions: number,
    public readonly startedAt: string,
    public readonly durationSeconds: number,
    public readonly completed: boolean,
    public readonly clientSessionId: string,
    public readonly createdAt: string,
    public readonly mantraId?: string,
    public readonly mantraTextSnapshot?: string,
    public readonly endedAt?: string,
    public readonly idempotent?: boolean,
  ) {}
}
