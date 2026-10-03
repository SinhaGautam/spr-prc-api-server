import { logger } from "../../../lib/logger";

const store = new Map<string, { id: string; displayName: string; email?: string; timezone: string; language: string; status: "active" | "inactive" | "suspended" }>();

const seededUser = {
  id: "user-1",
  displayName: "Seeker",
  email: "seeker@example.com",
  timezone: "Asia/Kolkata",
  language: "en",
  status: "active" as const,
};

store.set(seededUser.id, seededUser);

export class UsersService {
  async getProfile(userId: string) {
    try {
      return store.get(userId) ?? seededUser;
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to load user profile");
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<typeof seededUser> & { timezone?: string; language?: string }) {
    try {
      const existing = store.get(userId) ?? seededUser;
      const next = {
        ...existing,
        id: userId,
        ...data,
      };

      store.set(userId, next);
      logger.info({ userId }, "User profile updated");
      return next;
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to update user profile");
      throw error;
    }
  }
}
