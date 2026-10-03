import type { AuthSession } from "../entities/AuthSession";
import type { SessionRepository } from "../application/SessionRepository";

export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, AuthSession>();

  async save(session: AuthSession): Promise<AuthSession> {
    this.sessions.set(session.token, session);
    return session;
  }

  async findByToken(token: string): Promise<AuthSession | null> {
    const session = this.sessions.get(token);
    if (!session || session.expiresAt.getTime() <= Date.now()) {
      this.sessions.delete(token);
      return null;
    }
    return session;
  }

  async deleteByToken(token: string): Promise<void> {
    this.sessions.delete(token);
  }
}

export const sessionRepository = new InMemorySessionRepository();
