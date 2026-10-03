import type { Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../../../lib/errors";
import { logger } from "../../../lib/logger";
import { AuthService } from "../application/AuthService";

const sessionRequestSchema = z.object({
  provider: z.enum(["mock", "apple", "google"]),
  subject: z.string().min(1),
  displayName: z.string().optional(),
});

export class AuthController {
  constructor(private readonly service: AuthService) {}

  createSession = async (req: Request, res: Response) => {
    try {
      const parsed = sessionRequestSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError("Invalid auth session payload", { issues: parsed.error.issues });
      res.status(201).json(await this.service.createSession(parsed.data));
    } catch (error) {
      logger.error({ err: error, endpoint: "auth/session" }, "Auth controller error");
      throw error;
    }
  };

  revokeSession = async (_req: Request, res: Response) => {
    try {
      await this.service.revokeSession();
      res.status(204).send();
    } catch (error) {
      logger.error({ err: error, endpoint: "auth/session" }, "Auth controller error");
      throw error;
    }
  };
}
