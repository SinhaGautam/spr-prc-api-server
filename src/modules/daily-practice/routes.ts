import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { DailyPracticeController } from "./controllers/DailyPracticeController";

export function createDailyPracticeRoutes(controller: DailyPracticeController): IRouter {
  const router = Router();
  router.get("/goals/today", requireAuthentication, asyncHandler((req, res) => controller.getGoalsToday(req, res)));
  return router;
}
