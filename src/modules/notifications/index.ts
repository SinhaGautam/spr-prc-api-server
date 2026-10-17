import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { preferencesService } from "../preferences";
import { userService } from "../users";
import { NotificationController } from "./controllers/NotificationController";
import { NotificationsService } from "./application/NotificationsService";
import { MongoNotificationRepository } from "./infrastructure/MongoNotificationRepository";
import { createNotificationRoutes } from "./routes";

const repository = new MongoNotificationRepository(getDatabase());
const service = new NotificationsService(repository, preferencesService, userService);
const controller = new NotificationController(service);

export default createNotificationRoutes(controller);
