import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { ProgressController } from "./controllers/ProgressController";

export function createProgressRoutes(controller: ProgressController): IRouter {
  const router = Router();
  router.get("/today", requireAuthentication, asyncHandler((req, res) => controller.getToday(req, res)));
  router.get("/history", requireAuthentication, asyncHandler((req, res) => controller.getHistory(req, res)));
  router.get("/streak", requireAuthentication, asyncHandler((req, res) => controller.getStreak(req, res)));
  return router;
}
