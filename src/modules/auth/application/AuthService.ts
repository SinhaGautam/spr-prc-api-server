import { randomUUID } from "node:crypto";
import { BaseApiService } from "../../../core/application/BaseApiService";
import type { CreateSessionRequest, } from "../contracts/AuthRequest";
import type { CreateSessionResponse } from "../contracts/AuthResponse";
import { AuthSession } from "../entities/AuthSession";
import type { SessionRepository } from "./SessionRepository";

export class AuthService extends BaseApiService {
  constructor(private readonly sessionRepository: SessionRepository) { super(); }

  async createSession(input: CreateSessionRequest): Promise<CreateSessionResponse> {
    return this.execute("auth.createSession", async () => {
      const userId = "user-1";
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const token = `mock-${randomUUID()}`;
      await this.sessionRepository.save(new AuthSession(token, userId, expiresAt));
      return {
        session: { token, expiresAt: expiresAt.toISOString() },
        user: {
          id: userId,
          displayName: input.displayName ?? "Seeker",
          provider: input.provider,
          status: "active",
          timezone: "Asia/Kolkata",
          language: "en",
        },
      };
    }, { provider: input.provider });
  }

  async revokeSession(token: string): Promise<void> {
    await this.execute("auth.revokeSession", () => this.sessionRepository.deleteByToken(token));
  }
}
