import type { MantraEntity } from "../entities/MantraEntity";
import type { NaamJapSessionEntity } from "../entities/NaamJapSessionEntity";

export interface NaamJapRepository {
  listMantras(): Promise<MantraEntity[]>;
  findByClientSessionId(userId: string, clientSessionId: string): Promise<NaamJapSessionEntity | null>;
  createSession(session: NaamJapSessionEntity): Promise<NaamJapSessionEntity>;
  listSessions(userId: string): Promise<NaamJapSessionEntity[]>;
}
