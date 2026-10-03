import { type Request, type Response } from "express";
import { z } from "zod";
import { logger } from "../../../lib/logger";
import { ValidationError } from "../../../lib/errors";
import { NaamJapService } from "../application/naamJapService";
import { MantraResponse, NaamJapSessionResponse } from "../application/response";

const sessionSchema = z.object({
  mantraId: z.string().optional(),
  mantraText: z.string().optional(),
  targetRepetitions: z.number().int().positive(),
  completedRepetitions: z.number().int().min(0),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  durationSeconds: z.number().int().nonnegative(),
  completed: z.boolean(),
  clientSessionId: z.string().min(1),
});

export class NaamJapController {
  constructor(private readonly service: NaamJapService) {}

  listMantras = async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = this.service.getAvailableMantras().map(
        (mantra) => new MantraResponse(mantra.id, mantra.name, mantra.text, mantra.language),
      );
      res.json({ items });
    } catch (error) {
      logger.error({ err: error }, "Controller error while listing naam jap mantras");
      throw error;
    }
  };

  createSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = sessionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid naam jap session payload", { issues: parsed.error.issues });
      }

      const { session, idempotent } = await this.service.createSession(parsed.data, req.user!.userId);
      const response = new NaamJapSessionResponse(
        session._id,
        session.userId,
        session.targetRepetitions,
        session.completedRepetitions,
        session.startedAt.toISOString(),
        session.durationSeconds,
        session.completed,
        session.clientSessionId,
        session.createdAt.toISOString(),
        session.mantraId,
        session.mantraTextSnapshot,
        session.endedAt?.toISOString(),
        idempotent ? true : undefined,
      );

      res.status(idempotent ? 200 : 201).json(response);
    } catch (error) {
      logger.error({ reqId: req.id, userId: req.user?.userId, err: error }, "Controller error while creating naam jap session");
      throw error;
    }
  };

  listSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await this.service.listSessionsForUser(req.user!.userId);
      const items = sessions.map(
        (session) =>
          new NaamJapSessionResponse(
            session._id,
            session.userId,
            session.targetRepetitions,
            session.completedRepetitions,
            session.startedAt.toISOString(),
            session.durationSeconds,
            session.completed,
            session.clientSessionId,
            session.createdAt.toISOString(),
            session.mantraId,
            session.mantraTextSnapshot,
            session.endedAt?.toISOString(),
          ),
      );

      res.json({ items });
    } catch (error) {
      logger.error({ reqId: req.id, userId: req.user?.userId, err: error }, "Controller error while listing naam jap sessions");
      throw error;
    }
  };
}
