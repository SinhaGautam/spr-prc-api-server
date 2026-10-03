import type { ObjectId } from "../../../shared/domain/types";

export class MeditationSessionEntity {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public plannedMinutes: number,
    public actualSeconds: number,
    public startedAt: Date,
    public completed: boolean,
    public clientSessionId: string,
    public presetId?: ObjectId,
    public endedAt?: Date,
    public completionReason?: "completed" | "interrupted" | "cancelled",
    public readonly createdAt: Date = new Date(),
  ) {}
}
