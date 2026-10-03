import type { Db } from "mongodb";
import type { ProgressRepository } from "../application/ProgressRepository";

type Document = Record<string, unknown>;

export class MongoProgressRepository implements ProgressRepository {
  constructor(private readonly db: Db) {}

  async getToday(userId: string, date: string) {
    const d = await this.db.collection<Document>("daily_progress").findOne({ userId, localDate: date });
    return {
      naam_jap: Boolean((d?.naamJap as Document | undefined)?.completed),
      meditation: Boolean((d?.meditation as Document | undefined)?.completed),
      completed: Boolean(d?.dayCompleted),
      date,
    };
  }

  async getHistory(userId: string, month: string) {
    const docs = await this.db.collection<Document>("daily_progress")
      .find({ userId, localDate: { $regex: `^${month}` } })
      .sort({ localDate: -1 }).toArray();
    return { month, items: docs.map((d) => ({ date: String(d.localDate), complete: Boolean(d.dayCompleted) })) };
  }

  async getStreak(userId: string) {
    const docs = await this.db.collection<Document>("daily_progress").find({ userId }).sort({ localDate: -1 }).toArray();
    let current = 0;
    for (const d of docs) {
      if (!d.dayCompleted) break;
      current += 1;
    }
    let longest = 0;
    let run = 0;
    for (const d of [...docs].reverse()) {
      run = d.dayCompleted ? run + 1 : 0;
      longest = Math.max(longest, run);
    }
    return { current, longest };
  }
}
