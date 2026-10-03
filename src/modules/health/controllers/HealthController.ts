import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import type { HealthService } from "../application/HealthService";

export class HealthController extends BaseController {
  constructor(private readonly service: HealthService) { super(); }
  async live(req: Request, res: Response): Promise<void> { this.ok(res, await this.service.getLive()); }
  async ready(req: Request, res: Response): Promise<void> {
    const result = await this.service.getReady();
    result.status === "ready" ? this.ok(res, result) : res.status(503).json({ data: result });
  }
}
