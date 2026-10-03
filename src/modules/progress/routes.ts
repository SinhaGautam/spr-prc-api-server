import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { requireAuthentication } from "../../middleware/auth";
import { ProgressService } from "./application/ProgressService";

const router: IRouter = Router();
const service = new ProgressService();

const historyQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  cursor: z.string().optional(),
});

router.get("/today", requireAuthentication, async (req, res) => {
  try {
    const payload = await service.getToday(req.user!.userId);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading today's practice progress");
    throw error;
  }
});

router.get("/history", requireAuthentication, async (req, res) => {
  try {
    const query = historyQuerySchema.parse(req.query);
    const payload = await service.getHistory(req.user!.userId, query.month);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading progress history");
    throw error;
  }
});

router.get("/streak", requireAuthentication, async (req, res) => {
  try {
    const payload = await service.getStreak(req.user!.userId);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading streak");
    throw error;
  }
});

export default router;
