import { Router, type IRouter } from "express";
import { BootstrapService } from "./application/BootstrapService";
import { BootstrapController } from "./controllers/BootstrapController";

const router: IRouter = Router();
const controller = new BootstrapController(new BootstrapService());

router.get("/", controller.get);

export default router;
