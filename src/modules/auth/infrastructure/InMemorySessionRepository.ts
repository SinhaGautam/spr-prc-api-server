import { createHash } from "node:crypto";
import { AuthSession } from "../entities/AuthSession";
import type { SessionRepository } from "../application/SessionRepository";

function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, AuthSession>();

  async save(session: AuthSession): Promise<AuthSession> {
    this.sessions.set(session.tokenHash, session);
    return session;
  }

  async findByToken(token: string): Promise<AuthSession | null> {
    const hash = hashToken(token);
    const session = this.sessions.get(hash);
    if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      this.sessions.delete(hash);
      return null;
    }
    return session;
  }

  async deleteByToken(token: string): Promise<void> {
    const hash = hashToken(token);
    const session = this.sessions.get(hash);
    if (session) {
      this.sessions.set(hash, new AuthSession(
        session.tokenHash,
        session.userId,
        session.installationId,
        session.expiresAt,
        session.createdAt,
        new Date(),
      ));
    }
  }
}
