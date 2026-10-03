import { randomUUID } from "node:crypto";
import { DependencyError, NotFoundError } from "../../../lib/errors";
import { logger } from "../../../lib/logger";
import type { NaamJapSessionEntityRepository } from "../../../shared/application/repositories";
import { NaamJapSessionEntityEntity } from "../entities/NaamJapSessionEntityEntity";

export type NaamJapSessionEntityInput = {
  mantraId?: string;
  mantraText?: string;
  targetRepetitions: number;
  completedRepetitions: number;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  completed: boolean;
  clientSessionId: string;
};

export type MantraCatalogItem = {
  id: string;
  name: string;
  text: string;
  language: string;
};

const mantraCatalog: MantraCatalogItem[] = [
  { id: "mantra-1", name: "Hari Naam", text: "Hare Krishna", language: "en" },
  { id: "mantra-2", name: "Shivaya Namah", text: "Om Namah Shivaya", language: "sa" },
  { id: "mantra-3", name: "Ram Naam", text: "Ram Ram", language: "hi" },
];

export class NaamJapService {
  constructor(private readonly repository: NaamJapSessionEntityRepository, private readonly log = logger) {}

  getAvailableMantras(): MantraCatalogItem[] {
    return [...mantraCatalog];
  }

  async createSession(input: NaamJapSessionEntityInput, userId: string): Promise<{ session: NaamJapSessionEntity; idempotent: boolean }> {
    try {
      const existingSession = await this.repository.findByClientSessionId(userId, input.clientSessionId);
      if (existingSession) {
        this.log.info({ userId, clientSessionId: input.clientSessionId }, "Duplicate naam jap session request ignored");
        return { session: existingSession, idempotent: true };
      }

      const selectedMantra = input.mantraId ? mantraCatalog.find((mantra) => mantra.id === input.mantraId) : undefined;
      if (input.mantraId && !selectedMantra) {
        throw new NotFoundError(`Mantra ${input.mantraId} was not found`);
      }

      const session = new NaamJapSessionEntity(
        `naam-jap-session-${randomUUID()}`,
        userId,
        input.targetRepetitions,
        input.completedRepetitions,
        new Date(input.startedAt),
        input.durationSeconds,
        input.completed || input.completedRepetitions >= input.targetRepetitions,
        input.clientSessionId,
        input.mantraId,
        input.mantraText?.trim() || selectedMantra?.text,
        input.endedAt ? new Date(input.endedAt) : undefined,
        new Date(),
      );

      await this.repository.create(session);
      this.log.info({ userId, clientSessionId: input.clientSessionId, sessionId: session._id }, "Naam jap session created");
      return { session, idempotent: false };
    } catch (error) {
      this.log.error({ userId, clientSessionId: input.clientSessionId, err: error }, "Application error while creating naam jap session");
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DependencyError("Failed to create naam jap session", {
        userId,
        clientSessionId: input.clientSessionId,
      });
    }
  }

  async listSessionsForUser(userId: string): Promise<NaamJapSessionEntity[]> {
    try {
      return await this.repository.listByUser(userId);
    } catch (error) {
      this.log.error({ userId, err: error }, "Application error while listing naam jap sessions");
      throw new DependencyError("Failed to load naam jap sessions", { userId });
    }
  }
}
