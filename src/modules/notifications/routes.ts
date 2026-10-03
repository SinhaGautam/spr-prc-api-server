import { Router, type IRouter } from "express";
import { requireAuthentication } from "../../middleware/auth";
import { NotificationsService } from "./application/NotificationsService";
import { NotificationsController } from "./controllers/NotificationsController";

const router: IRouter = Router();
const controller = new NotificationsController(new NotificationsService());

router.put("/me/reminder", requireAuthentication, controller.updateReminder);
router.post("/devices", requireAuthentication, controller.registerDevice);
router.delete("/devices/:deviceId", requireAuthentication, controller.deleteDevice);

export default router;
