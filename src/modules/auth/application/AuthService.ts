import { randomUUID } from "node:crypto";
import { BaseApiService } from "../../../core/application/BaseApiService";
import type { CreateSessionRequest } from "../contracts/AuthRequest";
import type { CreateSessionResponse } from "../contracts/AuthResponse";
import { AuthSession } from "../entities/AuthSession";
import type { SessionRepository } from "./SessionRepository";
import type { UserRepository } from "../../users/application/UserRepository";
import { UserEntity } from "../../users/entities/UserEntity";

export class AuthService extends BaseApiService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
  ) { super(); }

  async createSession(input: CreateSessionRequest): Promise<CreateSessionResponse> {
    return this.execute("auth.createSession", async () => {
      let user = await this.userRepository.findByAuth(input.provider, input.subject);
      if (!user) {
        user = new UserEntity(
          randomUUID(),
          input.provider,
          input.subject,
          "Asia/Kolkata",
          "en",
          "active",
          input.displayName ?? "Seeker",
        );
        await this.userRepository.create(user);
      }

      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const token = `mock-${randomUUID()}`;
      await this.sessionRepository.save(new AuthSession(token, String(user._id), expiresAt));

      return {
        session: { token, expiresAt: expiresAt.toISOString() },
        user: {
          id: String(user._id),
          displayName: user.displayName ?? "Seeker",
          provider: user.authProvider,
          status: user.status,
          timezone: user.timezone,
          language: user.language,
        },
      };
    }, { provider: input.provider, subject: input.subject });
  }

  async revokeSession(token: string): Promise<void> {
    await this.execute("auth.revokeSession", () => this.sessionRepository.deleteByToken(token));
  }
}
