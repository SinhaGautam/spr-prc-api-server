import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { DailyPracticeController } from "./controllers/DailyPracticeController";

export function createDailyPracticeRoutes(controller: DailyPracticeController): IRouter {
  const router = Router();
  router.get("/goals/today", requireAuthentication, asyncHandler((req, res) => controller.getGoalsToday(req, res)));
  router.get("/progress/today", requireAuthentication, asyncHandler((req, res) => controller.getProgressToday(req, res)));
  router.get("/progress/history", requireAuthentication, asyncHandler((req, res) => controller.getHistory(req, res)));
  router.get("/progress/streak", requireAuthentication, asyncHandler((req, res) => controller.getStreak(req, res)));
  return router;
}
