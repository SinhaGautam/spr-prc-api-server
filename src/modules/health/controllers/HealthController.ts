import type { Request, Response } from "express";
import { logger } from "../../../lib/logger";
import { HealthService } from "../application/HealthService";

export class HealthController {
  constructor(private readonly service: HealthService) {}

  live = async (_req: Request, res: Response) => {
    try { res.json(await this.service.getLive()); }
    catch (error) { logger.error({ err: error }, "Health live controller error"); throw error; }
  };

  ready = async (_req: Request, res: Response) => {
    try { res.json(await this.service.getReady()); }
    catch (error) { logger.error({ err: error }, "Health ready controller error"); throw error; }
  };
}
