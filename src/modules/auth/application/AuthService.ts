import { logger } from "../../../lib/logger";

export type AuthSessionInput = {
  provider: "mock" | "apple" | "google";
  subject: string;
  displayName?: string;
};

export class AuthService {
  async createSession(input: AuthSessionInput) {
    try {
      const session = {
        token: "mock-session-token",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      };

      const user = {
        id: "user-1",
        displayName: input.displayName ?? "Seeker",
        provider: input.provider,
        subject: input.subject,
        status: "active",
        timezone: "Asia/Kolkata",
        language: "en",
      };

      logger.info({ provider: input.provider, subject: input.subject }, "Auth session created");
      return { session, user };
    } catch (error) {
      logger.error({ err: error, provider: input.provider }, "Failed to create auth session");
      throw error;
    }
  }

  async revokeSession(): Promise<void> {
    logger.info("Auth session revoked");
  }
}
