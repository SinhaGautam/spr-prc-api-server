import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./application/AuthService";
import { sessionRepository } from "./infrastructure/InMemorySessionRepository";
import { createAuthRoutes } from "./routes";

const service = new AuthService(sessionRepository);
const controller = new AuthController(service);

export { sessionRepository };
export default createAuthRoutes(controller);
