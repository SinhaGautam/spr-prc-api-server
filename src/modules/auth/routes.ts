import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { ValidationError } from "../../lib/errors";
import { AuthService } from "./application/AuthService";

const router: IRouter = Router();
const service = new AuthService();

const sessionRequestSchema = z.object({
  provider: z.enum(["mock", "apple", "google"]),
  subject: z.string().min(1),
  displayName: z.string().optional(),
});

router.post("/session", async (req, res) => {
  try {
    const parsed = sessionRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid auth session payload", { issues: parsed.error.issues });
    }

    const result = await service.createSession(parsed.data);
    res.status(201).json(result);
  } catch (error) {
    logger.error({ err: error, endpoint: "auth/session" }, "Controller error while creating auth session");
    throw error;
  }
});

router.delete("/session", async (_req, res) => {
  try {
    await service.revokeSession();
    res.status(204).send();
  } catch (error) {
    logger.error({ err: error, endpoint: "auth/session" }, "Controller error while revoking auth session");
    throw error;
  }
});

export default router;
