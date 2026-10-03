import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { requireAuthentication } from "../../middleware/auth";
import { DailyPracticeService } from "./application/DailyPracticeService";

const router: IRouter = Router();
const service = new DailyPracticeService();

const historyQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  cursor: z.string().optional(),
});

router.get("/goals/today", requireAuthentication, async (req, res) => {
  try {
    const payload = await service.getGoalsToday(req.user!.userId);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading daily goals");
    throw error;
  }
});

router.get("/progress/today", requireAuthentication, async (req, res) => {
  try {
    const payload = await service.getProgressToday(req.user!.userId);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading today's progress");
    throw error;
  }
});

router.get("/progress/history", requireAuthentication, async (req, res) => {
  try {
    const query = historyQuerySchema.parse(req.query);
    const payload = await service.getHistory(req.user!.userId, query.month);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading progress history");
    throw error;
  }
});

router.get("/progress/streak", requireAuthentication, async (req, res) => {
  try {
    const payload = await service.getStreak(req.user!.userId);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading streak information");
    throw error;
  }
});

export default router;
