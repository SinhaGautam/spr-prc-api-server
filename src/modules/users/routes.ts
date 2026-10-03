import { Router, type IRouter } from "express";
import { requireAuthentication } from "../../middleware/auth";
import { UserController } from "./controllers/UserController";

export function createUserRoutes(controller: UserController): IRouter {
  const router: IRouter = Router();

  router.get("/", requireAuthentication, controller.getProfile.bind(controller));
  router.put("/", requireAuthentication, controller.updateProfile.bind(controller));

  return router;
}
