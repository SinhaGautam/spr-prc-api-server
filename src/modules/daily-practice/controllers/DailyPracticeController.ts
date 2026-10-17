import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import type { DailyPracticeService } from "../application/DailyPracticeService";

export class DailyPracticeController extends BaseController {
  constructor(private readonly service: DailyPracticeService) { super(); }

  async getGoalsToday(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.getGoalsToday(req.user!.userId));
  }
}
