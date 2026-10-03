import { Router, type IRouter } from "express";
import { requireAuthentication } from "../../middleware/auth";
import { ProgressService } from "./application/ProgressService";
import { ProgressController } from "./controllers/ProgressController";

const router: IRouter = Router();
const controller = new ProgressController(new ProgressService());

router.get("/today", requireAuthentication, controller.today);
router.get("/history", requireAuthentication, controller.history);
router.get("/streak", requireAuthentication, controller.streak);

export default router;
