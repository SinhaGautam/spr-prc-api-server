import { Router, type IRouter } from "express";
import { HomeService } from "./application/HomeService";
import { HomeController } from "./controllers/HomeController";

const router: IRouter = Router();
const controller = new HomeController(new HomeService());

router.get("/today", controller.getToday);

export default router;
