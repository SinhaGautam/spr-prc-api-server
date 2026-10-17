import { createHash } from "node:crypto";
import type { Db } from "mongodb";
import type { SessionRepository } from "../application/SessionRepository";
import { AuthSession } from "../entities/AuthSession";

function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export class MongoSessionRepository implements SessionRepository {
  constructor(private readonly db: Db) {}

  async save(session: AuthSession): Promise<AuthSession> {
    await this.db.collection("sessions").insertOne({
      tokenHash: session.tokenHash,
      userId: session.userId,
      installationId: session.installationId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      revokedAt: session.revokedAt ?? null,
    });
    return session;
  }

  async findByToken(token: string): Promise<AuthSession | null> {
    const doc = await this.db.collection("sessions").findOne({
      tokenHash: hashToken(token),
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
    if (!doc) return null;
    return new AuthSession(
      String(doc.tokenHash),
      String(doc.userId),
      String(doc.installationId),
      new Date(doc.expiresAt as Date),
      new Date(doc.createdAt as Date),
      doc.revokedAt ? new Date(doc.revokedAt as Date) : undefined,
    );
  }

  async deleteByToken(token: string): Promise<void> {
    await this.db.collection("sessions").updateOne(
      { tokenHash: hashToken(token), revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }
}
