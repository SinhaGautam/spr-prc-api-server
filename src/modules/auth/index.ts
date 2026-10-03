import { sessionRepository } from "./infrastructure/InMemorySessionRepository";
import { userRepository } from "../users";
import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./application/AuthService";
import { createAuthRoutes } from "./routes";

const service = new AuthService(sessionRepository, userRepository);
const controller = new AuthController(service);

export { sessionRepository };
export default createAuthRoutes(controller);
