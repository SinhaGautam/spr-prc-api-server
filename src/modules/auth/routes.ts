import { Router, type IRouter } from "express";
import { asyncHandler } from "../../middleware/AsyncHandler";
import { requireAuthentication } from "../../middleware/auth";
import { AuthController } from "./controllers/AuthController";

export function createAuthRoutes(controller: AuthController): IRouter {
  const router = Router();
  router.post("/session", asyncHandler((req, res) => controller.createSession(req, res)));
  router.delete("/session", requireAuthentication, asyncHandler((req, res) => controller.revokeSession(req, res)));
  return router;
}
