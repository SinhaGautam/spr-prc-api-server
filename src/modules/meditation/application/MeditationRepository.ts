import type { MeditationPresetEntity } from "../entities/MeditationPresetEntity";
import type { MeditationSessionEntity } from "../entities/MeditationSessionEntity";

export interface MeditationRepository {
  listPresets(): Promise<MeditationPresetEntity[]>;
  findSessionByClientSessionId(userId: string, clientSessionId: string): Promise<MeditationSessionEntity | null>;
  createSession(session: MeditationSessionEntity): Promise<MeditationSessionEntity>;
  listSessions(userId: string): Promise<MeditationSessionEntity[]>;
}
