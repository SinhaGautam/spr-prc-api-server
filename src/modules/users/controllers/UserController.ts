import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import type { UpdateUserRequest } from "../contracts/UserRequest";
import { updateUserRequestSchema } from "../schemas/UserSchema";
import { UserService } from "../application/UserService";

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    const result = await this.userService.getProfile(req.user!.userId);
    this.ok(res, result);
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const parsed = updateUserRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ValidationError("Invalid user profile payload", {
        issues: parsed.error.issues,
      });
    }

    const request: UpdateUserRequest = parsed.data;
    const result = await this.userService.updateProfile(req.user!.userId, request);

    this.ok(res, result);
  }
}
