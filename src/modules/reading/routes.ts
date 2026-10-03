import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { ValidationError } from "../../lib/errors";
import { requireAuthentication } from "../../middleware/auth";
import { ReadingService } from "./application/ReadingService";

const router: IRouter = Router();
const service = new ReadingService();

const readingListQuerySchema = z.object({
  language: z.string().optional(),
  tradition: z.string().optional(),
  focus: z.string().optional(),
  tag: z.string().optional(),
  cursor: z.string().optional(),
});

const readingProgressSchema = z.object({
  progressPercent: z.number().min(0).max(100),
});

router.get("/", async (req, res) => {
  try {
    const query = readingListQuerySchema.parse(req.query);
    const payload = await service.listReadings(query);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, endpoint: "readings" }, "Controller error while listing readings");
    throw error;
  }
});

router.get("/:readingId", async (req, res) => {
  try {
    const payload = await service.getReading(String(req.params.readingId));
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, readingId: req.params.readingId }, "Controller error while loading reading");
    throw error;
  }
});

router.put("/:readingId/progress", requireAuthentication, async (req, res) => {
  try {
    const parsed = readingProgressSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid reading progress payload", { issues: parsed.error.issues });
    }

    const payload = await service.updateProgress(req.user!.userId, String(req.params.readingId), parsed.data.progressPercent);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId, readingId: req.params.readingId }, "Controller error while updating reading progress");
    throw error;
  }
});

router.post("/:readingId/complete", requireAuthentication, async (req, res) => {
  try {
    const payload = await service.completeReading(req.user!.userId, String(req.params.readingId));
    res.status(202).json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId, readingId: req.params.readingId }, "Controller error while completing reading");
    throw error;
  }
});

export default router;
