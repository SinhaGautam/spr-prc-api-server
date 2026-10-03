import { Router, type IRouter } from "express";
import { logger } from "../../lib/logger";
import { HealthService } from "./application/HealthService";

const router: IRouter = Router();
const service = new HealthService();

router.get("/live", async (_req, res) => {
  try {
    const payload = await service.getLive();
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, endpoint: "health/live" }, "Controller error while loading live health");
    throw error;
  }
});

router.get("/ready", async (_req, res) => {
  try {
    const payload = await service.getReady();
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, endpoint: "health/ready" }, "Controller error while loading ready health");
    throw error;
  }
});

export default router;
