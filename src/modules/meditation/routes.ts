import { Router, type IRouter } from "express";
import { requireAuthentication } from "../../middleware/auth";
import { MeditationService } from "./application/MeditationService";
import { MeditationController } from "./controllers/MeditationController";

const router: IRouter = Router();
const controller = new MeditationController(new MeditationService());

router.get("/presets", controller.listPresets);
router.post("/sessions", requireAuthentication, controller.createSession);
router.get("/sessions", requireAuthentication, controller.listSessions);

export default router;
