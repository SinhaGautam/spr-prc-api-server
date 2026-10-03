import { Router, type IRouter } from "express";
import { requireAuthentication } from "../../middleware/auth";
import { DailyPracticeService } from "./application/DailyPracticeService";
import { DailyPracticeController } from "./controllers/DailyPracticeController";

const router: IRouter = Router();
const controller = new DailyPracticeController(new DailyPracticeService());

router.get("/goals/today", requireAuthentication, controller.getGoalsToday);
router.get("/progress/today", requireAuthentication, controller.getProgressToday);
router.get("/progress/history", requireAuthentication, controller.getHistory);
router.get("/progress/streak", requireAuthentication, controller.getStreak);

export default router;
