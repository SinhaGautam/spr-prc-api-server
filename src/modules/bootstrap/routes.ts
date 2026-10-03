import { Router, type IRouter } from "express";
import { logger } from "../../lib/logger";
import { BootstrapService } from "./application/BootstrapService";

const router: IRouter = Router();
const service = new BootstrapService();

router.get("/", async (_req, res) => {
  try {
    const payload = await service.getBootstrapData();
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, endpoint: "bootstrap" }, "Controller error while loading bootstrap data");
    throw error;
  }
});

export default router;
