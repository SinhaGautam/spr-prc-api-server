import type { Request, Response } from "express";
import { z } from "zod";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import type { UpdateUserRequest } from "../contracts/UserRequest";
import { UserService } from "../application/UserService";

const updateUserSchema = z.object({
  displayName: z.string().trim().min(1).max(100).optional(),
  email: z.string().email().optional(),
  timezone: z.string().trim().min(1).max(100),
  language: z.string().trim().min(2).max(10),
});

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.getProfile(req.user!.userId);
    this.ok(res, result);
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ValidationError("Invalid user profile payload", {
        issues: parsed.error.issues,
      });
    }

    const request: UpdateUserRequest = parsed.data;
    const result = await this.userService.updateProfile(req.user!.userId, request);

    this.ok(res, result);
  };
}
