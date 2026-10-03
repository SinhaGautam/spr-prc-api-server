import { Router, type IRouter } from "express";
import { AuthService } from "./application/AuthService";
import { AuthController } from "./controllers/AuthController";

const router: IRouter = Router();
const controller = new AuthController(new AuthService());

router.post("/session", controller.createSession);
router.delete("/session", controller.revokeSession);

export default router;
