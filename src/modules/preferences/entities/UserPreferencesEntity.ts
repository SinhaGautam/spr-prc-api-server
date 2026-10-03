import type { ObjectId, Practice, ReminderConfig } from "../../../shared/domain/types";

export class UserPreferencesEntity {
  constructor(
    public readonly _id: ObjectId,
    public readonly userId: ObjectId,
    public traditionId: ObjectId,
    public enabledPractices: Practice[],
    public language: string,
    public reminder: ReminderConfig,
    public primaryFocusId?: ObjectId,
    public naamJapTarget?: { repetitions: number },
    public meditationTarget?: { minutes: number },
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
