import type { Request, Response } from "express";
import { z } from "zod";
import { logger } from "../../../lib/logger";
import { requireAuthentication } from "../../../middleware/auth";
import { DailyPracticeService } from "../application/DailyPracticeService";

const historyQuerySchema = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/).optional(), cursor: z.string().optional() });

export class DailyPracticeController {
  constructor(private readonly service: DailyPracticeService) {}

  getGoalsToday = async (req: Request, res: Response) => {
    try { res.json(await this.service.getGoalsToday(req.user!.userId)); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Daily practice controller error"); throw error; }
  };

  getProgressToday = async (req: Request, res: Response) => {
    try { res.json(await this.service.getProgressToday(req.user!.userId)); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Daily practice controller error"); throw error; }
  };

  getHistory = async (req: Request, res: Response) => {
    try {
      const query = historyQuerySchema.parse(req.query);
      res.json(await this.service.getHistory(req.user!.userId, query.month));
    } catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Daily practice controller error"); throw error; }
  };

  getStreak = async (req: Request, res: Response) => {
    try { res.json(await this.service.getStreak(req.user!.userId)); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Daily practice controller error"); throw error; }
  };
}
