import type { Collection, Db } from "mongodb";
import { logger } from "../../../lib/logger";
import type { NaamJapSessionEntityRepository } from "../../../shared/application/repositories";
import { NaamJapSessionEntityEntity } from "../entities/NaamJapSessionEntityEntity";
import type { ObjectId } from "../../../shared/domain/types";

type JsonDoc = Record<string, unknown>;

function mapSession(doc: JsonDoc): NaamJapSessionEntity {
  return new NaamJapSessionEntity(
    String(doc._id ?? ""),
    String(doc.userId ?? ""),
    Number(doc.targetRepetitions ?? 0),
    Number(doc.completedRepetitions ?? 0),
    doc.startedAt instanceof Date ? doc.startedAt : new Date(String(doc.startedAt ?? Date.now())),
    Number(doc.durationSeconds ?? 0),
    !!doc.completed,
    String(doc.clientSessionId ?? ""),
    typeof doc.mantraId === "string" ? doc.mantraId : undefined,
    typeof doc.mantraTextSnapshot === "string" ? doc.mantraTextSnapshot : undefined,
    doc.endedAt ? (doc.endedAt instanceof Date ? doc.endedAt : new Date(String(doc.endedAt))) : undefined,
    doc.createdAt instanceof Date ? doc.createdAt : new Date(String(doc.createdAt ?? Date.now())),
  );
}

export class InMemoryNaamJapSessionEntityRepository implements NaamJapSessionEntityRepository {
  private readonly sessions = new Map<string, NaamJapSessionEntity>();

  async create(session: NaamJapSessionEntity): Promise<NaamJapSessionEntity> {
    this.sessions.set(`${session.userId}:${session.clientSessionId}`, session);
    logger.debug({ userId: session.userId, clientSessionId: session.clientSessionId }, "Stored naam jap session in memory");
    return session;
  }

  async findByClientSessionId(userId: ObjectId, clientSessionId: string): Promise<NaamJapSessionEntity | null> {
    return this.sessions.get(`${userId}:${clientSessionId}`) ?? null;
  }

  async listByUser(userId: ObjectId): Promise<NaamJapSessionEntity[]> {
    return Array.from(this.sessions.values())
      .filter((session) => session.userId === userId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }
}

export class MongoNaamJapSessionEntityRepository implements NaamJapSessionEntityRepository {
  constructor(private readonly db: Db) {}

  private collection(): Collection<JsonDoc> {
    return this.db.collection<JsonDoc>("naam_jap_sessions");
  }

  async create(session: NaamJapSessionEntity): Promise<NaamJapSessionEntity> {
    await this.collection().insertOne({ ...session, _id: session._id } as JsonDoc);
    return session;
  }

  async findByClientSessionId(userId: ObjectId, clientSessionId: string): Promise<NaamJapSessionEntity | null> {
    const doc = await this.collection().findOne({ userId, clientSessionId } as JsonDoc);
    return doc ? mapSession(doc as JsonDoc) : null;
  }

  async listByUser(userId: ObjectId): Promise<NaamJapSessionEntity[]> {
    const docs = await this.collection().find({ userId } as JsonDoc).sort({ startedAt: -1 }).toArray();
    return docs.map((doc) => mapSession(doc as JsonDoc));
  }
}
