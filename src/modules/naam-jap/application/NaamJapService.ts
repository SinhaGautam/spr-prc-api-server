import { randomUUID } from "node:crypto";
import { BaseApiService } from "../../../core/application/BaseApiService";
import { ConflictError } from "../../../lib/errors";
import type { CreateNaamJapSessionRequest } from "../contracts/NaamJapRequest";
import { NaamJapSessionEntity } from "../entities/NaamJapSessionEntity";
import type { NaamJapRepository } from "./NaamJapRepository";
import type { PracticeCompletionPort } from "../../daily-practice/application/PracticeCompletionPort";
import type { FeatureAvailabilityService } from "../../features/application/FeatureAvailabilityService";

const FEATURE_KEY = "spr-naamjaap-enabled";

export class NaamJapService extends BaseApiService {
  constructor(
    private readonly repository: NaamJapRepository,
    private readonly completionPort: PracticeCompletionPort,
    private readonly featureAvailability: FeatureAvailabilityService,
  ) { super(); }

  isEnabled(): Promise<boolean> { return this.featureAvailability.isActive(FEATURE_KEY); }

  async createSession(userId: string, request: CreateNaamJapSessionRequest) {
    return this.execute("naamJap.createSession", async () => {
      const existing = await this.repository.findByClientSessionId(userId, request.clientSessionId);
      if (existing) return { session: this.toResponse(existing), idempotent: true };
      await this.featureAvailability.requireActive(FEATURE_KEY, "Naam Jap");
      if (request.completedRepetitions > request.targetRepetitions) throw new ConflictError("Completed repetitions cannot exceed target repetitions");
      const session = new NaamJapSessionEntity(
        randomUUID(), userId, request.targetRepetitions, request.completedRepetitions,
        new Date(request.startedAt), request.durationSeconds,
        request.completed || request.completedRepetitions >= request.targetRepetitions,
        request.clientSessionId, undefined, undefined,
        request.endedAt ? new Date(request.endedAt) : undefined,
      );
      const saved = await this.repository.createSession(session);
      if (saved.completed) await this.completionPort.recordNaamJapCompletion(userId, saved.completedRepetitions);
      return { session: this.toResponse(saved), idempotent: false };
    }, { userId, clientSessionId: request.clientSessionId });
  }

  async listSessions(userId: string) {
    return this.execute("naamJap.listSessions", async () => ({ items: (await this.repository.listSessions(userId)).map((item) => this.toResponse(item)) }), { userId });
  }

  private toResponse(session: NaamJapSessionEntity) {
    return {
      id: session._id, userId: session.userId, targetRepetitions: session.targetRepetitions,
      completedRepetitions: session.completedRepetitions, startedAt: session.startedAt.toISOString(),
      durationSeconds: session.durationSeconds, completed: session.completed,
      clientSessionId: session.clientSessionId, createdAt: session.createdAt.toISOString(),
      endedAt: session.endedAt?.toISOString(),
    };
  }
}
