import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { HomeController } from "./controllers/HomeController";

export function createHomeRoutes(controller: HomeController): IRouter {
  const router = Router();
  router.get("/", requireAuthentication, asyncHandler((req, res) => controller.getData(req, res)));
  return router;
}
