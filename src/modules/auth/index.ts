import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./application/AuthService";
import { InMemorySessionRepository } from "./infrastructure/InMemorySessionRepository";
import { createAuthRoutes } from "./routes";

const sessionRepository = new InMemorySessionRepository();
const service = new AuthService(sessionRepository);
const controller = new AuthController(service);

export default createAuthRoutes(controller);
