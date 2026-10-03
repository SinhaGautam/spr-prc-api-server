import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../../lib/logger";
import { ValidationError } from "../../lib/errors";
import { SongsService } from "./application/SongsService";

const router: IRouter = Router();
const service = new SongsService();

const querySchema = z.object({
  language: z.string().optional(),
  tradition: z.string().optional(),
  focus: z.string().optional(),
  tag: z.string().optional(),
  cursor: z.string().optional(),
});

const playbackEventSchema = z.object({ type: z.enum(["started", "resumed", "completed", "stopped"]) });

router.get("/", async (req, res) => {
  try {
    const query = querySchema.parse(req.query);
    const payload = await service.listSongs(query);
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, endpoint: "songs" }, "Controller error while listing songs");
    throw error;
  }
});

router.get("/:songId", async (req, res) => {
  try {
    const payload = await service.getSong(String(req.params.songId));
    res.json(payload);
  } catch (error) {
    logger.error({ err: error, songId: req.params.songId }, "Controller error while loading song metadata");
    throw error;
  }
});

router.post("/:songId/playback-events", async (req, res) => {
  try {
    const body = playbackEventSchema.safeParse(req.body);
    if (!body.success) {
      throw new ValidationError("Invalid song playback payload", { issues: body.error.issues });
    }

    const payload = await service.recordPlaybackEvent(String(req.params.songId), body.data.type);
    res.status(202).json(payload);
  } catch (error) {
    logger.error({ err: error, songId: req.params.songId }, "Controller error while recording song playback");
    throw error;
  }
});

export default router;
