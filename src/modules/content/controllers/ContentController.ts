import type { Request, Response } from "express";
import { logger } from "../../../lib/logger";
import { ContentService } from "../application/ContentService";

export class ContentController {
  constructor(private readonly service: ContentService) {}

  list = async (_req: Request, res: Response) => {
    try {
      const payload = await this.service.listPublished();
      res.json({ ...payload, total: payload.items.length });
    } catch (error) {
      logger.error({ err: error }, "Content controller error");
      throw error;
    }
  };
}
