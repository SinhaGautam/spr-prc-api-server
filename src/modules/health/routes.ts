import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { HealthController } from "./controllers/HealthController";

export function createHealthRoutes(controller: HealthController): IRouter {
  const router = Router();
  router.get("/live", asyncHandler((req, res) => controller.live(req, res)));
  router.get("/ready", asyncHandler((req, res) => controller.ready(req, res)));
  return router;
}
