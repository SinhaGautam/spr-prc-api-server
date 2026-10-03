import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { BootstrapController } from "./controllers/BootstrapController";

export function createBootstrapRoutes(controller: BootstrapController): IRouter {
  const router = Router();
  router.get("/", asyncHandler((req, res) => controller.get(req, res)));
  return router;
}
