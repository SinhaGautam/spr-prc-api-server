import type { ObjectId, Practice } from "../../../shared/domain/types";

export class DailyGoalSnapshotEntity {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public date: string,
    public enabledPractices: Practice[],
    public naamJapComplete: boolean,
    public meditationComplete: boolean,
    public allComplete: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
