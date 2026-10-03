import type { Request, Response } from "express";
import { z } from "zod";
import { logger } from "../../../lib/logger";
import { ProgressService } from "../application/ProgressService";

const historySchema = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/).optional(), cursor: z.string().optional() });

export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  today = async (req: Request, res: Response) => {
    try { res.json(await this.service.getToday(req.user!.userId)); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Progress controller error"); throw error; }
  };

  history = async (req: Request, res: Response) => {
    try { const q = historySchema.parse(req.query); res.json(await this.service.getHistory(req.user!.userId, q.month)); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Progress controller error"); throw error; }
  };

  streak = async (req: Request, res: Response) => {
    try { res.json(await this.service.getStreak(req.user!.userId)); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Progress controller error"); throw error; }
  };
}
