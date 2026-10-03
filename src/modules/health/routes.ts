import { Router, type IRouter } from "express";
import { HealthService } from "./application/HealthService";
import { HealthController } from "./controllers/HealthController";

const router: IRouter = Router();
const controller = new HealthController(new HealthService());

router.get("/live", controller.live);
router.get("/ready", controller.ready);

export default router;
