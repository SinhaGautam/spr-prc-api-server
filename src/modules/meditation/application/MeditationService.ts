import { logger } from "../../../lib/logger";

const meditationPresets = [
  { id: "preset-5", key: "five_minutes", durationMinutes: 5 },
  { id: "preset-10", key: "ten_minutes", durationMinutes: 10 },
  { id: "preset-15", key: "fifteen_minutes", durationMinutes: 15 },
  { id: "preset-20", key: "twenty_minutes", durationMinutes: 20 },
] as const;

const sessionStore = new Map<string, Array<Record<string, unknown>>>();

export class MeditationService {
  async listPresets() {
    try {
      return { items: meditationPresets.map((preset) => ({ id: preset.id, key: preset.key, durationMinutes: preset.durationMinutes })) };
    } catch (error) {
      logger.error({ err: error }, "Failed to list meditation presets");
      throw error;
    }
  }

  async createSession(userId: string, payload: { presetId?: string; plannedMinutes: number; actualSeconds: number; startedAt: string; endedAt?: string; completed: boolean; completionReason?: "completed" | "interrupted" | "cancelled"; clientSessionId: string }) {
    try {
      const list = sessionStore.get(userId) ?? [];
      const duplicate = list.find((item) => item.clientSessionId === payload.clientSessionId);
      if (duplicate) {
        logger.info({ userId, clientSessionId: payload.clientSessionId }, "Duplicate meditation session ignored");
        return { session: duplicate, idempotent: true };
      }

      const session = {
        id: `meditation-session-${Date.now()}`,
        userId,
        ...payload,
        createdAt: new Date().toISOString(),
      };

      list.push(session);
      sessionStore.set(userId, list);
      logger.info({ userId, sessionId: session.id }, "Meditation session created");
      return { session, idempotent: false };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to create meditation session");
      throw error;
    }
  }

  async listSessions(userId: string) {
    try {
      return { items: sessionStore.get(userId) ?? [] };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to list meditation sessions");
      throw error;
    }
  }
}
