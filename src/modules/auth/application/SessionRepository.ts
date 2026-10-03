import type { AuthSession } from "../entities/AuthSession";

export interface SessionRepository {
  save(session: AuthSession): Promise<AuthSession>;
  findByToken(token: string): Promise<AuthSession | null>;
  deleteByToken(token: string): Promise<void>;
}
