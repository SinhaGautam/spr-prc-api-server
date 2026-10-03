import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { MeditationController } from "./controllers/MeditationController";

export function createMeditationRoutes(controller: MeditationController): IRouter {
  const router = Router();
  router.get("/presets", asyncHandler((req, res) => controller.listPresets(req, res)));
  router.post("/sessions", requireAuthentication, asyncHandler((req, res) => controller.createSession(req, res)));
  router.get("/sessions", requireAuthentication, asyncHandler((req, res) => controller.listSessions(req, res)));
  return router;
}
