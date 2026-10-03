import type { ObjectId } from "../../../shared/domain/types";

export class NaamJapSessionEntity {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public targetRepetitions: number,
    public completedRepetitions: number,
    public startedAt: Date,
    public durationSeconds: number,
    public completed: boolean,
    public clientSessionId: string,
    public mantraId?: ObjectId,
    public mantraTextSnapshot?: string,
    public endedAt?: Date,
    public readonly createdAt: Date = new Date(),
  ) {}
}
