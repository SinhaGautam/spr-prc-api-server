import type { Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../../../lib/errors";
import { logger } from "../../../lib/logger";
import { MeditationService } from "../application/MeditationService";

const sessionSchema = z.object({
  presetId: z.string().optional(),
  plannedMinutes: z.number().int().positive(),
  actualSeconds: z.number().int().nonnegative(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  completed: z.boolean(),
  completionReason: z.enum(["completed", "interrupted", "cancelled"]).optional(),
  clientSessionId: z.string().min(1),
});

export class MeditationController {
  constructor(private readonly service: MeditationService) {}

  listPresets = async (_req: Request, res: Response) => {
    try { res.json(await this.service.listPresets()); }
    catch (error) { logger.error({ err: error }, "Meditation controller error"); throw error; }
  };

  createSession = async (req: Request, res: Response) => {
    try {
      const parsed = sessionSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError("Invalid meditation session payload", { issues: parsed.error.issues });
      const result = await this.service.createSession(req.user!.userId, parsed.data);
      res.status(result.idempotent ? 200 : 201).json(result.session);
    } catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Meditation controller error"); throw error; }
  };

  listSessions = async (req: Request, res: Response) => {
    try { res.json(await this.service.listSessions(req.user!.userId)); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Meditation controller error"); throw error; }
  };
}
