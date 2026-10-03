import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { preferencesService } from "../preferences";
import { userService } from "../users";
import { NotificationController } from "./controllers/NotificationController";
import { NotificationsService } from "./application/NotificationsService";
import { InMemoryNotificationRepository } from "./infrastructure/InMemoryNotificationRepository";
import { MongoNotificationRepository } from "./infrastructure/MongoNotificationRepository";
import { createNotificationRoutes } from "./routes";

const database = getDatabase();
const repository = database ? new MongoNotificationRepository(database) : new InMemoryNotificationRepository();
const service = new NotificationsService(repository, preferencesService, userService);
const controller = new NotificationController(service);

export default createNotificationRoutes(controller);
