import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { NaamJapController } from "./controllers/NaamJapController";

export function createNaamJapRoutes(controller: NaamJapController): IRouter {
  const router = Router();
  router.post("/sessions", requireAuthentication, asyncHandler((req, res) => controller.createSession(req, res)));
  router.get("/sessions", requireAuthentication, asyncHandler((req, res) => controller.listSessions(req, res)));
  return router;
}
