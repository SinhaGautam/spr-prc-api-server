import { userRepository } from "../users";
import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./application/AuthService";
import { createAuthRoutes } from "./routes";
import { installationRepository, sessionRepository } from "./repositories";

const service = new AuthService(sessionRepository, userRepository, installationRepository);
const controller = new AuthController(service);

export { sessionRepository };
export default createAuthRoutes(controller);
