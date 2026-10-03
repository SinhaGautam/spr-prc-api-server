import type { Request, Response } from "express";
import { logger } from "../../../lib/logger";
import { BootstrapService } from "../application/BootstrapService";

export class BootstrapController {
  constructor(private readonly service: BootstrapService) {}

  get = async (_req: Request, res: Response) => {
    try {
      res.json(await this.service.getBootstrapData());
    } catch (error) {
      logger.error({ err: error }, "Bootstrap controller error");
      throw error;
    }
  };
}
