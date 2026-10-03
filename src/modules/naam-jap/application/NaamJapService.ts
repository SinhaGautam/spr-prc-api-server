import { randomUUID } from "node:crypto";
import { BaseApiService } from "../../../core/application/BaseApiService";
import { ConflictError, NotFoundError } from "../../../lib/errors";
import type { CreateNaamJapSessionRequest } from "../contracts/NaamJapRequest";
import { NaamJapSessionEntity } from "../entities/NaamJapSessionEntity";
import type { NaamJapRepository } from "./NaamJapRepository";
import type { PracticeCompletionPort } from "../../daily-practice/application/PracticeCompletionPort";

export class NaamJapService extends BaseApiService {
  constructor(
    private readonly repository: NaamJapRepository,
    private readonly completionPort: PracticeCompletionPort,
  ) { super(); }

  async listMantras() {
    return this.execute("naamJap.listMantras", async () => ({
      items: (await this.repository.listMantras()).map((item) => ({ id: item._id, name: item.name, text: item.text, language: item.language })),
    }));
  }

  async createSession(userId: string, request: CreateNaamJapSessionRequest) {
    return this.execute("naamJap.createSession", async () => {
      const existing = await this.repository.findByClientSessionId(userId, request.clientSessionId);
      if (existing) return { session: this.toResponse(existing), idempotent: true };
      if (request.completedRepetitions > request.targetRepetitions) throw new ConflictError("Completed repetitions cannot exceed target repetitions");

      const mantras = await this.repository.listMantras();
      const mantra = request.mantraId ? mantras.find((item) => item._id === request.mantraId) : undefined;
      if (request.mantraId && !mantra) throw new NotFoundError("Mantra not found");

      const session = new NaamJapSessionEntity(
        randomUUID(), userId, request.targetRepetitions, request.completedRepetitions,
        new Date(request.startedAt), request.durationSeconds,
        request.completed || request.completedRepetitions >= request.targetRepetitions,
        request.clientSessionId, request.mantraId, request.mantraText ?? mantra?.text,
        request.endedAt ? new Date(request.endedAt) : undefined,
      );
      const saved = await this.repository.createSession(session);
      if (saved.completed) await this.completionPort.recordNaamJapCompletion(userId, saved.completedRepetitions);
      return { session: this.toResponse(saved), idempotent: false };
    }, { userId, clientSessionId: request.clientSessionId });
  }

  async listSessions(userId: string) {
    return this.execute("naamJap.listSessions", async () => ({
      items: (await this.repository.listSessions(userId)).map((item) => this.toResponse(item)),
    }), { userId });
  }

  private toResponse(session: NaamJapSessionEntity) {
    return {
      id: session._id, userId: session.userId, targetRepetitions: session.targetRepetitions,
      completedRepetitions: session.completedRepetitions, startedAt: session.startedAt.toISOString(),
      durationSeconds: session.durationSeconds, completed: session.completed,
      clientSessionId: session.clientSessionId, createdAt: session.createdAt.toISOString(),
      mantraId: session.mantraId, mantraTextSnapshot: session.mantraTextSnapshot,
      endedAt: session.endedAt?.toISOString(),
    };
  }
}
