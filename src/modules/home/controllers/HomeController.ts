import type { Request, Response } from "express";
import { logger } from "../../../lib/logger";
import { HomeService } from "../application/HomeService";

export class HomeController {
  constructor(private readonly service: HomeService) {}

  getToday = async (_req: Request, res: Response) => {
    try { res.json(await this.service.getTodayView()); }
    catch (error) { logger.error({ err: error }, "Home controller error"); throw error; }
  };
}
