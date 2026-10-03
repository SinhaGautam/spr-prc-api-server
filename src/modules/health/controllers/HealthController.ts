import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import type { HealthService } from "../application/HealthService";

export class HealthController extends BaseController {
  constructor(private readonly service: HealthService) { super(); }
  async live(_req: Request, res: Response): Promise<void> { this.ok(res, await this.service.getLive()); }
  async ready(_req: Request, res: Response): Promise<void> {
    const result = await this.service.getReady();
    if (result.status === "ready") this.ok(res, result);
    else res.status(503).json(result);
  }
}
