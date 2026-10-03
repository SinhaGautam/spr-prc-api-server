import type { Practice, ReminderConfig } from "../../../shared/domain/types";

export class UserPreferencesEntity {
  constructor(
    public readonly _id: string,
    public readonly userId: string,
    public traditionId: string,
    public enabledPractices: Practice[],
    public language: string,
    public reminder: ReminderConfig,
    public primaryFocusId?: string,
    public naamJapTarget?: { repetitions: number },
    public meditationTarget?: { minutes: number },
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
