import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import type { BootstrapService } from "../application/BootstrapService";

export class BootstrapController extends BaseController {
  constructor(private readonly service: BootstrapService) { super(); }
  async get(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.getBootstrapData());
  }
}
