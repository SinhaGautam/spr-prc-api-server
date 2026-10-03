import { Router, type IRouter } from "express";
import { requireAuthentication } from "../../middleware/auth";
import { UsersService } from "./application/UsersService";
import { UsersController } from "./controllers/UsersController";

const router: IRouter = Router();
const controller = new UsersController(new UsersService());

router.get("/", requireAuthentication, controller.get);
router.put("/", requireAuthentication, controller.update);

export default router;
