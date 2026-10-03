import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { ValidationError } from "../../lib/errors";
import { requireAuthentication } from "../../middleware/auth";
import { PreferencesService } from "./application/PreferencesService";

const router: IRouter = Router();
const service = new PreferencesService();

const preferencesSchema = z.object({
  traditionId: z.string().min(1),
  primaryFocusId: z.string().optional(),
  enabledPractices: z.array(z.enum(["naam_jap", "meditation"])).min(1),
  naamJapTarget: z.number().int().positive().optional(),
  meditationTargetMinutes: z.number().int().positive().optional(),
  reminder: z
    .object({
      enabled: z.boolean(),
      localTime: z.string().min(1).optional(),
    })
    .optional(),
});

router.get("/preferences", requireAuthentication, async (req, res) => {
  try {
    const preferences = await service.getPreferences(req.user!.userId);
    res.json({ userId: req.user!.userId, preferences });
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading preferences");
    throw error;
  }
});

router.put("/preferences", requireAuthentication, async (req, res) => {
  try {
    const parsed = preferencesSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid preferences payload", { issues: parsed.error.issues });
    }

    const preferences = await service.updatePreferences(req.user!.userId, parsed.data);
    res.json({
      userId: req.user!.userId,
      preferences,
      todaysGoalSnapshot: {
        date: new Date().toISOString().slice(0, 10),
        complete: false,
        enabledPractices: preferences.enabledPractices,
      },
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while updating preferences");
    throw error;
  }
});

export default router;
