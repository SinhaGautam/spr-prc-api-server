import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { NotificationController } from "./controllers/NotificationController";

export function createNotificationRoutes(controller: NotificationController): IRouter {
  const router = Router();
  router.put("/me/reminder", requireAuthentication, asyncHandler((req, res) => controller.updateReminder(req, res)));
  router.post("/devices", requireAuthentication, asyncHandler((req, res) => controller.registerDevice(req, res)));
  router.delete("/devices/:deviceId", requireAuthentication, asyncHandler((req, res) => controller.deleteDevice(req, res)));
  return router;
}
