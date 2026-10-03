import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import { historyQuerySchema } from "../schemas/DailyPracticeSchema";
import type { DailyPracticeService } from "../application/DailyPracticeService";

export class DailyPracticeController extends BaseController {
  constructor(private readonly service: DailyPracticeService) { super(); }

  async getGoalsToday(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.getGoalsToday(req.user!.userId));
  }

  async getProgressToday(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.getProgressToday(req.user!.userId));
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    const parsed = historyQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid history query");
    this.ok(res, await this.service.getHistory(req.user!.userId, parsed.data.month));
  }

  async getStreak(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.getStreak(req.user!.userId));
  }
}
