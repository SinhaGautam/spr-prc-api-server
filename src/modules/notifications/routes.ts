import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { ValidationError } from "../../lib/errors";
import { requireAuthentication } from "../../middleware/auth";
import { NotificationsService } from "./application/NotificationsService";

const router: IRouter = Router();
const service = new NotificationsService();

const reminderSchema = z.object({
  enabled: z.boolean(),
  localTime: z.string().optional(),
});

const deviceSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(["ios", "android"]),
});

router.put("/me/reminder", requireAuthentication, async (req, res) => {
  try {
    const payload = reminderSchema.safeParse(req.body);
    if (!payload.success) {
      throw new ValidationError("Invalid reminder payload", { issues: payload.error.issues });
    }

    const result = await service.updateReminder(req.user!.userId, payload.data);
    res.json({
      userId: req.user!.userId,
      reminder: result.reminder,
      timezone: "Asia/Kolkata",
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while updating reminder settings");
    throw error;
  }
});

router.post("/devices", requireAuthentication, async (req, res) => {
  try {
    const payload = deviceSchema.safeParse(req.body);
    if (!payload.success) {
      throw new ValidationError("Invalid device payload", { issues: payload.error.issues });
    }

    const result = await service.registerDevice(req.user!.userId, payload.data);
    res.status(201).json(result);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while registering device");
    throw error;
  }
});

router.delete("/devices/:deviceId", requireAuthentication, async (req, res) => {
  try {
    const result = await service.deleteDevice(req.user!.userId, String(req.params.deviceId));
    res.status(204).json(result);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId, deviceId: req.params.deviceId }, "Controller error while removing device");
    throw error;
  }
});

export default router;
