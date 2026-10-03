import { Router, type IRouter } from "express";
import authRouter from "../modules/auth";
import bootstrapRouter from "../modules/bootstrap";
import contentRouter from "../modules/content";
import dailyPracticeRouter from "../modules/daily-practice";
import healthRouter from "../modules/health";
import homeRouter from "../modules/home";
import meditationRouter from "../modules/meditation";
import naamJapRouter from "../modules/naam-jap";
import notificationsRouter from "../modules/notifications";
import preferencesRouter from "../modules/preferences";
import usersRouter from "../modules/users";

const router: IRouter = Router();
const v1Router: IRouter = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/bootstrap", bootstrapRouter);
v1Router.use("/content", contentRouter);
v1Router.use("/home", homeRouter);
v1Router.use("/me", usersRouter);
v1Router.use("/me", preferencesRouter);
v1Router.use("/", naamJapRouter);
v1Router.use("/meditation", meditationRouter);
v1Router.use("/", dailyPracticeRouter);
v1Router.use("/", notificationsRouter);
v1Router.use("/health", healthRouter);

router.use("/v1", v1Router);

export default router;
