import type { NaamJapRepository } from "../application/NaamJapRepository";
import { MantraEntity } from "../entities/MantraEntity";
import type { NaamJapSessionEntity } from "../entities/NaamJapSessionEntity";

export class InMemoryNaamJapRepository implements NaamJapRepository {
  private readonly sessions = new Map<string, NaamJapSessionEntity>();

  async listMantras(): Promise<MantraEntity[]> {
    return [
      new MantraEntity("mantra-1", "Hari Naam", "Hare Krishna", "en"),
      new MantraEntity("mantra-2", "Shivaya Namah", "Om Namah Shivaya", "sa"),
      new MantraEntity("mantra-3", "Ram Naam", "Ram Ram", "hi"),
    ];
  }

  async findByClientSessionId(userId: string, clientSessionId: string): Promise<NaamJapSessionEntity | null> {
    return this.sessions.get(`${userId}:${clientSessionId}`) ?? null;
  }

  async createSession(session: NaamJapSessionEntity): Promise<NaamJapSessionEntity> {
    this.sessions.set(`${session.userId}:${session.clientSessionId}`, session);
    return session;
  }

  async listSessions(userId: string): Promise<NaamJapSessionEntity[]> {
    return [...this.sessions.values()].filter((item) => item.userId === userId);
  }
}
