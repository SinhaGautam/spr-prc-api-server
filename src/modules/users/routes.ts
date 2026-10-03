import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { ValidationError } from "../../lib/errors";
import { requireAuthentication } from "../../middleware/auth";
import { UsersService } from "./application/UsersService";

const router: IRouter = Router();
const service = new UsersService();

const profileSchema = z.object({
  displayName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  timezone: z.string().min(1).default("Asia/Kolkata"),
  language: z.string().min(1).default("en"),
});

router.get("/", requireAuthentication, async (req, res) => {
  try {
    const user = await service.getProfile(req.user!.userId);
    res.json({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      timezone: user.timezone,
      language: user.language,
      status: user.status,
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while loading profile");
    throw error;
  }
});

router.put("/", requireAuthentication, async (req, res) => {
  try {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid profile payload", { issues: parsed.error.issues });
    }

    const user = await service.updateProfile(req.user!.userId, parsed.data);
    res.json({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      timezone: user.timezone,
      language: user.language,
      status: user.status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while updating profile");
    throw error;
  }
});

export default router;
