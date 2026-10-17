import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { FeaturesController } from "./controllers/FeaturesController";

export function createFeaturesRoutes(controller: FeaturesController): IRouter {
  const router = Router();
  router.get("/", requireAuthentication, asyncHandler((req, res) => controller.list(req, res)));
  return router;
}
