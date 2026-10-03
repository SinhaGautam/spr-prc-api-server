import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import { createNaamJapSessionSchema } from "../schemas/NaamJapSchema";
import type { NaamJapService } from "../application/NaamJapService";

export class NaamJapController extends BaseController {
  constructor(private readonly service: NaamJapService) { super(); }

  async listMantras(_req: Request, res: Response): Promise<void> { this.ok(res, await this.service.listMantras()); }

  async createSession(req: Request, res: Response): Promise<void> {
    const parsed = createNaamJapSessionSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid naam jap session payload");
    const result = await this.service.createSession(req.user!.userId, parsed.data);
    result.idempotent ? this.ok(res, result.session) : this.created(res, result.session);
  }

  async listSessions(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.listSessions(req.user!.userId));
  }
}
