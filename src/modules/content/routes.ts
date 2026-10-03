import { Router, type IRouter } from "express";
import { ContentService } from "./application/ContentService";
import { ContentController } from "./controllers/ContentController";

const router: IRouter = Router();
const controller = new ContentController(new ContentService());

router.get("/", controller.list);

export default router;
