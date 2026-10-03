import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { NaamJapController } from "./controllers/NaamJapController";

export function createNaamJapRoutes(controller: NaamJapController): IRouter {
  const router = Router();
  router.get("/mantras", asyncHandler((req, res) => controller.listMantras(req, res)));
  router.post("/naam-jap/sessions", requireAuthentication, asyncHandler((req, res) => controller.createSession(req, res)));
  router.get("/naam-jap/sessions", requireAuthentication, asyncHandler((req, res) => controller.listSessions(req, res)));
  return router;
}
