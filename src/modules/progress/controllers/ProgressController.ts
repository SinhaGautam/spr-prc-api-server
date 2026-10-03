import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import { progressHistoryQuerySchema } from "../schemas/ProgressSchema";
import type { ProgressService } from "../application/ProgressService";

export class ProgressController extends BaseController {
  constructor(private readonly service: ProgressService) { super(); }

  async getToday(req: Request, res: Response): Promise<void> { this.ok(res, await this.service.getToday(req.user!.userId)); }

  async getHistory(req: Request, res: Response): Promise<void> {
    const parsed = progressHistoryQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid progress history query");
    this.ok(res, await this.service.getHistory(req.user!.userId, parsed.data.month));
  }

  async getStreak(req: Request, res: Response): Promise<void> { this.ok(res, await this.service.getStreak(req.user!.userId)); }
}
