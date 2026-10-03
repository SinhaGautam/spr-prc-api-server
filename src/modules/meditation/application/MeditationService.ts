import { randomUUID } from "node:crypto";
import { BaseApiService } from "../../../core/application/BaseApiService";
import { ConflictError } from "../../../lib/errors";
import type { CreateMeditationSessionRequest } from "../contracts/MeditationRequest";
import type { MeditationRepository } from "./MeditationRepository";
import { MeditationSessionEntity } from "../entities/MeditationSessionEntity";

export class MeditationService extends BaseApiService {
  constructor(private readonly repository: MeditationRepository) { super(); }

  async listPresets() {
    return this.execute("meditation.listPresets", async () => {
      const presets = await this.repository.listPresets();
      return { items: presets.map((item) => ({ id: String(item._id), key: item.key, durationMinutes: item.durationMinutes })) };
    });
  }

  async createSession(userId: string, request: CreateMeditationSessionRequest) {
    return this.execute("meditation.createSession", async () => {
      const existing = await this.repository.findSessionByClientSessionId(userId, request.clientSessionId);
      if (existing) return { session: this.toResponse(existing), idempotent: true };

      if (request.actualSeconds > request.plannedMinutes * 60) {
        throw new ConflictError("Meditation duration exceeds planned duration");
      }

      const session = new MeditationSessionEntity(
        randomUUID(), userId, request.plannedMinutes, request.actualSeconds,
        new Date(request.startedAt), request.completed, request.clientSessionId,
        request.presetId, request.endedAt ? new Date(request.endedAt) : undefined,
        request.completionReason,
      );

      const saved = await this.repository.createSession(session);
      return { session: this.toResponse(saved), idempotent: false };
    }, { userId, clientSessionId: request.clientSessionId });
  }

  async listSessions(userId: string) {
    return this.execute("meditation.listSessions", async () => {
      const sessions = await this.repository.listSessions(userId);
      return { items: sessions.map((item) => this.toResponse(item)) };
    }, { userId });
  }

  private toResponse(session: MeditationSessionEntity) {
    return {
      id: session._id,
      userId: session.userId,
      plannedMinutes: session.plannedMinutes,
      actualSeconds: session.actualSeconds,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString(),
      completed: session.completed,
      completionReason: session.completionReason,
      clientSessionId: session.clientSessionId,
    };
  }
}
