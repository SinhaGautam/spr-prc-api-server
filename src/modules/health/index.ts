import { HealthController } from "./controllers/HealthController";
import { HealthService } from "./application/HealthService";
import { createHealthRoutes } from "./routes";

const service = new HealthService();
const controller = new HealthController(service);

export default createHealthRoutes(controller);
