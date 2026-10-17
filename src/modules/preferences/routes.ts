import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { PreferencesController } from "./controllers/PreferencesController";

export function createPreferencesRoutes(controller: PreferencesController): IRouter {
  const router = Router();
  router.get("/", requireAuthentication, asyncHandler((req, res) => controller.get(req, res)));
  router.put("/", requireAuthentication, asyncHandler((req, res) => controller.update(req, res)));
  return router;
}
