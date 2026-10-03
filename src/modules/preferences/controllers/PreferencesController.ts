import type { Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../../../lib/errors";
import { logger } from "../../../lib/logger";
import { PreferencesService } from "../application/PreferencesService";

const schema = z.object({
  traditionId: z.string().min(1),
  primaryFocusId: z.string().optional(),
  enabledPractices: z.array(z.enum(["naam_jap", "meditation"])).min(1),
  naamJapTarget: z.number().int().positive().optional(),
  meditationTargetMinutes: z.number().int().positive().optional(),
  reminder: z.object({ enabled: z.boolean(), localTime: z.string().min(1).optional() }).optional(),
});

export class PreferencesController {
  constructor(private readonly service: PreferencesService) {}

  get = async (req: Request, res: Response) => {
    try { res.json({ userId: req.user!.userId, preferences: await this.service.getPreferences(req.user!.userId) }); }
    catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Preferences controller error"); throw error; }
  };

  update = async (req: Request, res: Response) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError("Invalid preferences payload", { issues: parsed.error.issues });
      const preferences = await this.service.updatePreferences(req.user!.userId, parsed.data);
      res.json({ userId: req.user!.userId, preferences, todaysGoalSnapshot: { date: new Date().toISOString().slice(0, 10), complete: false, enabledPractices: preferences.enabledPractices } });
    } catch (error) { logger.error({ err: error, userId: req.user?.userId }, "Preferences controller error"); throw error; }
  };
}
