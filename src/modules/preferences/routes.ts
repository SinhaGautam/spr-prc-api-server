import { Router, type IRouter } from "express";
import { requireAuthentication } from "../../middleware/auth";
import { PreferencesService } from "./application/PreferencesService";
import { PreferencesController } from "./controllers/PreferencesController";

const router: IRouter = Router();
const controller = new PreferencesController(new PreferencesService());

router.get("/preferences", requireAuthentication, controller.get);
router.put("/preferences", requireAuthentication, controller.update);

export default router;
