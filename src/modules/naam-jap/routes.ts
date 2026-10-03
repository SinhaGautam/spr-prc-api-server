import { Router, type IRouter } from "express";
import { logger } from "../../lib/logger";
import { getMongoDb } from "../../lib/mongodb";
import { requireAuthentication } from "../../middleware/auth";
import { NaamJapService } from "./application/naamJapService";
import { NaamJapController } from "./controllers/naamJapController";
import { InMemoryNaamJapSessionRepository, MongoNaamJapSessionRepository } from "./infrastructure/naamJapRepository";

const router: IRouter = Router();
const mongoDb = getMongoDb();
const repository = mongoDb ? new MongoNaamJapSessionRepository(mongoDb) : new InMemoryNaamJapSessionRepository();
const service = new NaamJapService(repository);
const controller = new NaamJapController(service);

logger.debug({ hasMongo: !!mongoDb }, "Initialized naam jap module repository");

router.get("/mantras", controller.listMantras);
router.post("/naam-jap/sessions", requireAuthentication, controller.createSession);
router.get("/naam-jap/sessions", requireAuthentication, controller.listSessions);

export default router;
