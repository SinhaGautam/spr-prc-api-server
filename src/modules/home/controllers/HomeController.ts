import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import type { HomeService } from "../application/HomeService";

export class HomeController extends BaseController {
  constructor(private readonly service: HomeService) { super(); }
  async getToday(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.getTodayView(req.user!.userId));
  }
}
