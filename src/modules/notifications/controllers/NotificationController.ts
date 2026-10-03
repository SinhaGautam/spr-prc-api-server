import type { Request, Response } from "express";
import { BaseController } from "../../../core/http/BaseController";
import { ValidationError } from "../../../lib/errors";
import { deviceIdSchema, registerDeviceSchema, updateReminderSchema } from "../schemas/NotificationSchema";
import type { NotificationsService } from "../application/NotificationsService";

export class NotificationController extends BaseController {
  constructor(private readonly service: NotificationsService) { super(); }

  async updateReminder(req: Request, res: Response): Promise<void> {
    const parsed = updateReminderSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid reminder payload");
    this.ok(res, await this.service.updateReminder(req.user!.userId, parsed.data));
  }

  async registerDevice(req: Request, res: Response): Promise<void> {
    const parsed = registerDeviceSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid device payload");
    this.created(res, await this.service.registerDevice(req.user!.userId, parsed.data));
  }

  async deleteDevice(req: Request, res: Response): Promise<void> {
    const parsed = deviceIdSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError("Invalid device identifier");
    await this.service.deleteDevice(req.user!.userId, parsed.data.deviceId);
    this.noContent(res);
  }
}
