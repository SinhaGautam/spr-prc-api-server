import type { NaamJapSessionEntity } from "../entities/NaamJapSessionEntity";

export interface NaamJapRepository {
  findByClientSessionId(userId: string, clientSessionId: string): Promise<NaamJapSessionEntity | null>;
  createSession(session: NaamJapSessionEntity): Promise<NaamJapSessionEntity>;
  listSessions(userId: string): Promise<NaamJapSessionEntity[]>;
}
