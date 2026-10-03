import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { HomeController } from "./controllers/HomeController";

export function createHomeRoutes(controller: HomeController): IRouter {
  const router = Router();
  router.get("/today", requireAuthentication, asyncHandler((req, res) => controller.getToday(req, res)));
  return router;
}
