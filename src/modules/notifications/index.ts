import { NotificationController } from "./controllers/NotificationController";
import { NotificationsService } from "./application/NotificationsService";
import { InMemoryNotificationRepository } from "./infrastructure/InMemoryNotificationRepository";
import { createNotificationRoutes } from "./routes";

const repository = new InMemoryNotificationRepository();
const service = new NotificationsService(repository);
const controller = new NotificationController(service);

export default createNotificationRoutes(controller);
