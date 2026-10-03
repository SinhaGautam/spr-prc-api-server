import type { Db } from "mongodb";
import type { MeditationRepository } from "../application/MeditationRepository";
import { MeditationPresetEntity } from "../entities/MeditationPresetEntity";
import { MeditationSessionEntity } from "../entities/MeditationSessionEntity";

type Document = Record<string, unknown>;
const asDate = (value: unknown) => value instanceof Date ? value : new Date(String(value));

export class MongoMeditationRepository implements MeditationRepository {
  constructor(private readonly db: Db) {}

  async listPresets(): Promise<MeditationPresetEntity[]> {
    const docs = await this.db.collection<Document>("meditation_presets").find({ status: "published" }).sort({ sortOrder: 1 }).toArray();
    return docs.map((d) => new MeditationPresetEntity(String(d._id), String(d.key), Number(d.durationMinutes), "published", Number(d.sortOrder ?? 0), d.startBellAssetId as string | undefined, d.endBellAssetId as string | undefined, d.ambientAssetId as string | undefined));
  }

  async findSessionByClientSessionId(userId: string, clientSessionId: string): Promise<MeditationSessionEntity | null> {
    const d = await this.db.collection<Document>("meditation_sessions").findOne({ userId, clientSessionId });
    return d ? this.mapSession(d) : null;
  }

  async createSession(session: MeditationSessionEntity): Promise<MeditationSessionEntity> {
    await this.db.collection<Document>("meditation_sessions").insertOne({ ...session });
    return session;
  }

  async listSessions(userId: string): Promise<MeditationSessionEntity[]> {
    const docs = await this.db.collection<Document>("meditation_sessions").find({ userId }).sort({ startedAt: -1 }).toArray();
    return docs.map((d) => this.mapSession(d));
  }

  private mapSession(d: Document): MeditationSessionEntity {
    return new MeditationSessionEntity(
      String(d._id), String(d.userId), Number(d.plannedMinutes ?? 0), Number(d.actualSeconds ?? 0),
      asDate(d.startedAt), Boolean(d.completed), String(d.clientSessionId),
      typeof d.presetId === "string" ? d.presetId : undefined,
      d.endedAt ? asDate(d.endedAt) : undefined,
      typeof d.completionReason === "string" ? d.completionReason as MeditationSessionEntity["completionReason"] : undefined,
      asDate(d.createdAt),
    );
  }
}
