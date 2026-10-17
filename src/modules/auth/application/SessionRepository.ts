import type { AuthSession } from "../entities/AuthSession";

export interface SessionRepository {
  save(session: AuthSession): Promise<AuthSession>;
  /** Accepts the raw bearer token; implementations hash it before lookup. */
  findByToken(token: string): Promise<AuthSession | null>;
  /** Accepts the raw bearer token; implementations hash it before deletion. */
  deleteByToken(token: string): Promise<void>;
}
