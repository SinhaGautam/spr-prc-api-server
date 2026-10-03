import type { Db } from "mongodb";
import type { DailyPracticeRepository } from "../application/DailyPracticeRepository";
import { DailyGoalEntity } from "../entities/DailyGoalEntity";

type Document = Record<string, unknown>;

export class MongoDailyPracticeRepository implements DailyPracticeRepository {
  constructor(private readonly db: Db) {}

  async get(userId: string, date: string): Promise<DailyGoalEntity | null> {
    const d = await this.db.collection<Document>("daily_goals").findOne({ userId, localDate: date });
    if (!d) return null;
    const naam = (d.naamJap ?? {}) as Document;
    const meditation = (d.meditation ?? {}) as Document;
    const enabled = [naam.enabled ? "naam_jap" : null, meditation.enabled ? "meditation" : null].filter(Boolean) as DailyGoalEntity["enabledPractices"];
    return new DailyGoalEntity(userId, date, enabled, Number(naam.targetRepetitions ?? 108), Number(meditation.targetMinutes ?? 15), Number(naam.progress ?? 0), Number(meditation.progressMinutes ?? 0));
  }

  async save(goal: DailyGoalEntity): Promise<DailyGoalEntity> {
    await this.db.collection<Document>("daily_goals").updateOne(
      { userId: goal.userId, localDate: goal.date },
      { $set: {
        userId: goal.userId, localDate: goal.date,
        naamJap: { enabled: goal.enabledPractices.includes("naam_jap"), targetRepetitions: goal.naamJapTarget, progress: goal.naamJapProgress },
        meditation: { enabled: goal.enabledPractices.includes("meditation"), targetMinutes: goal.meditationTargetMinutes, progressMinutes: goal.meditationProgressMinutes },
        updatedAt: new Date(),
      }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
    return goal;
  }

  async listByMonth(userId: string, month: string): Promise<DailyGoalEntity[]> {
    const docs = await this.db.collection<Document>("daily_goals").find({ userId, localDate: { $regex: `^${month}` } }).sort({ localDate: 1 }).toArray();
    const result: DailyGoalEntity[] = [];
    for (const d of docs) {
      const goal = await this.get(userId, String(d.localDate));
      if (goal) result.push(goal);
    }
    return result;
  }
}
