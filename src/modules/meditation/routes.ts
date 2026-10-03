import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { ValidationError } from "../../lib/errors";
import { requireAuthentication } from "../../middleware/auth";
import { MeditationService } from "./application/MeditationService";

const router: IRouter = Router();
const service = new MeditationService();

const meditationSessionSchema = z.object({
  presetId: z.string().optional(),
  plannedMinutes: z.number().int().positive(),
  actualSeconds: z.number().int().nonnegative(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  completed: z.boolean(),
  completionReason: z.enum(["completed", "interrupted", "cancelled"]).optional(),
  clientSessionId: z.string().min(1),
});

router.get("/presets", async (_req, res) => {
  try {
    const payload = await service.listPresets();
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, endpoint: "meditation/presets" }, "Controller error while loading meditation presets");
    throw error;
  }
});

router.post("/sessions", requireAuthentication, async (req, res) => {
  try {
    const parsed = meditationSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid meditation session payload", { issues: parsed.error.issues });
    }

    const result = await service.createSession(req.user!.userId, parsed.data);
    res.status(result.idempotent ? 200 : 201).json(result.session);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while creating meditation session");
    throw error;
  }
});

router.get("/sessions", requireAuthentication, async (req, res) => {
  try {
    const payload = await service.listSessions(req.user!.userId);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while listing meditation sessions");
    throw error;
  }
});

export default router;
