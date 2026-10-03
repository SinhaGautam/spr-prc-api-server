import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import { updatePreferencesSchema } from "../schemas/PreferencesSchema";
import type { PreferencesService } from "../application/PreferencesService";

export class PreferencesController extends BaseController {
  constructor(private readonly service: PreferencesService) { super(); }

  async get(req: Request, res: Response): Promise<void> {
    const result = await this.service.getPreferences(req.user!.userId);
    this.ok(res, result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const parsed = updatePreferencesSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid preferences payload");
    const result = await this.service.updatePreferences(req.user!.userId, parsed.data);
    this.ok(res, result);
  }
}
