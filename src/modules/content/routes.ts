import { Router, type IRouter } from "express";
import { logger } from "../../lib/logger";
import { ContentService } from "./application/ContentService";

const router: IRouter = Router();
const service = new ContentService();

router.get("/", async (_req, res) => {
  try {
    const payload = await service.listPublished();
    res.json({ ...payload, total: payload.items.length });
  } catch (error) {
    logger.error({ err: error, endpoint: "content" }, "Controller error while loading content catalog");
    throw error;
  }
});

export default router;
