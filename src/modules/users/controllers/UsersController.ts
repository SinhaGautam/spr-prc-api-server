import type { Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../../../lib/errors";
import { logger } from "../../../lib/logger";
import { UsersService } from "../application/UsersService";

const profileSchema = z.object({
  displayName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  timezone: z.string().min(1).default("Asia/Kolkata"),
  language: z.string().min(1).default("en"),
});

export class UsersController {
  constructor(private readonly service: UsersService) {}

  get = async (req: Request, res: Response) => {
    try {
      const user = await this.service.getProfile(req.user!.userId);
      res.json({ id: user.id, displayName: user.displayName, email: user.email, timezone: user.timezone, language: user.language, status: user.status });
    } catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Users controller error"); throw error; }
  };

  update = async (req: Request, res: Response) => {
    try {
      const parsed = profileSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError("Invalid profile payload", { issues: parsed.error.issues });
      const user = await this.service.updateProfile(req.user!.userId, parsed.data);
      res.json({ id: user.id, displayName: user.displayName, email: user.email, timezone: user.timezone, language: user.language, status: user.status, updatedAt: new Date().toISOString() });
    } catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Users controller error"); throw error; }
  };
}
