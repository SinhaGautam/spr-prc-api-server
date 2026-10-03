import type { Db } from "mongodb";
import type { NaamJapRepository } from "../application/NaamJapRepository";
import { MantraEntity } from "../entities/MantraEntity";
import { NaamJapSessionEntity } from "../entities/NaamJapSessionEntity";

type Document = Record<string, unknown>;
const asDate = (value: unknown) => value instanceof Date ? value : new Date(String(value));

export class MongoNaamJapRepository implements NaamJapRepository {
  constructor(private readonly db: Db) {}

  async listMantras(): Promise<MantraEntity[]> {
    const docs = await this.db.collection<Document>("mantras").find({ status: "published" }).sort({ createdAt: -1 }).toArray();
    return docs.map((d) => new MantraEntity(String(d._id), String(d.name), String(d.text), String(d.language ?? "en")));
  }

  async findByClientSessionId(userId: string, clientSessionId: string): Promise<NaamJapSessionEntity | null> {
    const d = await this.db.collection<Document>("naam_jap_sessions").findOne({ userId, clientSessionId });
    return d ? this.mapSession(d) : null;
  }

  async createSession(session: NaamJapSessionEntity): Promise<NaamJapSessionEntity> {
    await this.db.collection<Document>("naam_jap_sessions").insertOne({ ...session });
    return session;
  }

  async listSessions(userId: string): Promise<NaamJapSessionEntity[]> {
    const docs = await this.db.collection<Document>("naam_jap_sessions").find({ userId }).sort({ startedAt: -1 }).toArray();
    return docs.map((d) => this.mapSession(d));
  }

  private mapSession(d: Document): NaamJapSessionEntity {
    return new NaamJapSessionEntity(
      String(d._id), String(d.userId), Number(d.targetRepetitions ?? 0), Number(d.completedRepetitions ?? 0),
      asDate(d.startedAt), Number(d.durationSeconds ?? 0), Boolean(d.completed), String(d.clientSessionId),
      typeof d.mantraId === "string" ? d.mantraId : undefined,
      typeof d.mantraTextSnapshot === "string" ? d.mantraTextSnapshot : undefined,
      d.endedAt ? asDate(d.endedAt) : undefined, asDate(d.createdAt),
    );
  }
}
