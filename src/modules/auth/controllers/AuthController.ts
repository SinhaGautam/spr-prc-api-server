import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import { createSessionRequestSchema } from "../schemas/AuthSchema";
import type { AuthService } from "../application/AuthService";

export class AuthController extends BaseController {
  constructor(private readonly service: AuthService) {
    super();
  }

  async createSession(req: Request, res: Response): Promise<void> {
    const parsed = createSessionRequestSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid authentication request");

    const result = await this.service.createSession(parsed.data);
    this.created(res, result);
  }

  async revokeSession(req: Request, res: Response): Promise<void> {
    const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (token) await this.service.revokeSession(token);
    this.noContent(res);
  }
}
