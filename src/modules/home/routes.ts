import { Router, type IRouter } from "express";
import { logger } from "../../lib/logger";
import { HomeService } from "./application/HomeService";

const router: IRouter = Router();
const service = new HomeService();

router.get("/today", async (_req, res) => {
  try {
    const payload = await service.getTodayView();
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, endpoint: "home/today" }, "Controller error while loading home data");
    throw error;
  }
});

export default router;
