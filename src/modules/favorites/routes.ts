import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { requireAuthentication } from "../../middleware/auth";
import { FavoritesService } from "./application/FavoritesService";

const router: IRouter = Router();
const service = new FavoritesService();

const entityTypeSchema = z.enum(["reading", "song", "mantra"]);

router.get("/", requireAuthentication, async (req, res) => {
  try {
    const entityType = req.query.entityType ? entityTypeSchema.parse(req.query.entityType) : undefined;
    const payload = await service.listFavorites(req.user!.userId, entityType);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId }, "Controller error while listing favorites");
    throw error;
  }
});

router.put("/:entityType/:entityId", requireAuthentication, async (req, res) => {
  try {
    const entityType = entityTypeSchema.parse(req.params.entityType);
    const payload = await service.addFavorite(req.user!.userId, entityType, String(req.params.entityId));
    res.status(201).json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId, entityType: req.params.entityType }, "Controller error while adding favorite");
    throw error;
  }
});

router.delete("/:entityType/:entityId", requireAuthentication, async (req, res) => {
  try {
    const entityType = entityTypeSchema.parse(req.params.entityType);
    const payload = await service.removeFavorite(req.user!.userId, entityType, String(req.params.entityId));
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, userId: req.user?.userId, entityType: req.params.entityType }, "Controller error while removing favorite");
    throw error;
  }
});

export default router;
