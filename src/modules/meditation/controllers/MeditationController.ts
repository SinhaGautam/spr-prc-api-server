import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import { createMeditationSessionSchema } from "../schemas/MeditationSchema";
import type { MeditationService } from "../application/MeditationService";

export class MeditationController extends BaseController {
  constructor(private readonly service: MeditationService) { super(); }

  async listPresets(_req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.listPresets());
  }

  async createSession(req: Request, res: Response): Promise<void> {
    const parsed = createMeditationSessionSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid meditation session payload");
    const result = await this.service.createSession(req.user!.userId, parsed.data);
    result.idempotent ? this.ok(res, result.session) : this.created(res, result.session);
  }

  async listSessions(req: Request, res: Response): Promise<void> {
    this.ok(res, await this.service.listSessions(req.user!.userId));
  }
}
