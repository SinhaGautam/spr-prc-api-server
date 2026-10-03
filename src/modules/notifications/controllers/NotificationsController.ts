import type { Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../../../lib/errors";
import { logger } from "../../../lib/logger";
import { NotificationsService } from "../application/NotificationsService";

const reminderSchema = z.object({ enabled: z.boolean(), localTime: z.string().optional() });
const deviceSchema = z.object({ token: z.string().min(1), platform: z.enum(["ios", "android"]) });

export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  updateReminder = async (req: Request, res: Response) => {
    try {
      const parsed = reminderSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError("Invalid reminder payload", { issues: parsed.error.issues });
      const result = await this.service.updateReminder(req.user!.userId, parsed.data);
      res.json({ userId: req.user!.userId, reminder: result.reminder, timezone: "Asia/Kolkata" });
    } catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Notifications controller error"); throw error; }
  };

  registerDevice = async (req: Request, res: Response) => {
    try {
      const parsed = deviceSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError("Invalid device payload", { issues: parsed.error.issues });
      res.status(201).json(await this.service.registerDevice(req.user!.userId, parsed.data));
    } catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Notifications controller error"); throw error; }
  };

  deleteDevice = async (req: Request, res: Response) => {
    try { await this.service.deleteDevice(req.user!.userId, String(req.params.deviceId)); res.status(204).send(); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Notifications controller error"); throw error; }
  };
}
