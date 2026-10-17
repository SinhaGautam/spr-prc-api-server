import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import type { FeaturesService } from "../application/FeaturesService";
import { featuresResponseSchema } from "../schemas";

export class FeaturesController extends BaseController {
  constructor(private readonly service: FeaturesService) { super(); }

  async list(_req: Request, res: Response): Promise<void> {
    const response = featuresResponseSchema.parse(await this.service.getEnabledFeatures());
    this.ok(res, response);
  }
}
