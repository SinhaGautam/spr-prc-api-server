import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { ContentController } from "./controllers/ContentController";

export function createContentRoutes(controller: ContentController): IRouter {
  const router = Router();
  router.get("/catalog", asyncHandler((req, res) => controller.getCatalog(req, res)));
  return router;
}
