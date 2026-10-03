import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import type { ContentService } from "../application/ContentService";

export class ContentController extends BaseController {
  constructor(private readonly service: ContentService) { super(); }

  async getCatalog(_req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.getCatalog());
  }
}
