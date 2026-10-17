import type { Db } from "mongodb";
import type { ProgressRepository } from "../application/ProgressRepository";

type Document = Record<string, unknown>;
type PracticeProgress = { enabled?: boolean; targetRepetitions?: number; progress?: number; targetMinutes?: number; progressMinutes?: number };
type DailyGoalDocument = Document & { userId?: string; localDate?: string; naamJap?: PracticeProgress; meditation?: PracticeProgress };

function completion(doc: DailyGoalDocument | null | undefined) {
  const naam = doc?.naamJap ?? {};
  const meditation = doc?.meditation ?? {};
  const naamEnabled = naam.enabled === true;
  const meditationEnabled = meditation.enabled === true;
  const naamComplete = naamEnabled && Number(naam.progress ?? 0) >= Number(naam.targetRepetitions ?? 108);
  const meditationComplete = meditationEnabled && Number(meditation.progressMinutes ?? 0) >= Number(meditation.targetMinutes ?? 15);
  const anyEnabled = naamEnabled || meditationEnabled;
  return {
    naam_jap: naamComplete,
    meditation: meditationComplete,
    completed: anyEnabled && (!naamEnabled || naamComplete) && (!meditationEnabled || meditationComplete),
  };
}

function utcDate(date: Date) { return date.toISOString().slice(0, 10); }
function shiftDate(date: string, offset: number) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return utcDate(value);
}

export class MongoProgressRepository implements ProgressRepository {
  constructor(private readonly db: Db) {}

  async getToday(userId: string, date: string) {
    const doc = await this.db.collection<DailyGoalDocument>("daily_goals").findOne({ userId, localDate: date });
    return { ...completion(doc), date };
  }

  async getHistory(userId: string, month: string) {
    const docs = await this.db.collection<DailyGoalDocument>("daily_goals")
      .find({ userId, localDate: { $regex: `^${month}` } })
      .sort({ localDate: 1 }).toArray();
    return { month, items: docs.map((doc) => ({ date: String(doc.localDate), complete: completion(doc).completed })) };
  }

  async getStreak(userId: string) {
    const docs = await this.db.collection<DailyGoalDocument>("daily_goals")
      .find({ userId }).sort({ localDate: -1 }).toArray();
    const completedDates = new Set(docs.filter((doc) => completion(doc).completed).map((doc) => String(doc.localDate)));
    const today = utcDate(new Date());
    let cursor = completedDates.has(today) ? today : shiftDate(today, -1);
    let current = 0;
    while (completedDates.has(cursor)) {
      current += 1;
      cursor = shiftDate(cursor, -1);
    }

    const ordered = [...completedDates].sort();
    let longest = 0;
    let run = 0;
    let previous: string | null = null;
    for (const date of ordered) {
      run = previous && shiftDate(previous, 1) === date ? run + 1 : 1;
      longest = Math.max(longest, run);
      previous = date;
    }
    return { current, longest };
  }
}
