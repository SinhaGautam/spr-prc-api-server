import type { MeditationRepository } from "../application/MeditationRepository";
import { MeditationPresetEntity } from "../entities/MeditationPresetEntity";
import type { MeditationSessionEntity } from "../entities/MeditationSessionEntity";

export class InMemoryMeditationRepository implements MeditationRepository {
  private readonly sessions = new Map<string, MeditationSessionEntity>();

  async listPresets(): Promise<MeditationPresetEntity[]> {
    return [5, 10, 15, 20].map((minutes, index) =>
      new MeditationPresetEntity(`preset-${minutes}`, `${minutes}_minutes`, minutes, "published", index + 1),
    );
  }

  async findSessionByClientSessionId(userId: string, clientSessionId: string): Promise<MeditationSessionEntity | null> {
    return [...this.sessions.values()].find((item) => item.userId === userId && item.clientSessionId === clientSessionId) ?? null;
  }

  async createSession(session: MeditationSessionEntity): Promise<MeditationSessionEntity> {
    this.sessions.set(session._id, session);
    return session;
  }

  async listSessions(userId: string): Promise<MeditationSessionEntity[]> {
    return [...this.sessions.values()].filter((item) => item.userId === userId);
  }
}
