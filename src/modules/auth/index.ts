import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { userRepository } from "../users";
import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./application/AuthService";
import { createAuthRoutes } from "./routes";
import { InMemorySessionRepository } from "./infrastructure/InMemorySessionRepository";
import { MongoSessionRepository } from "./infrastructure/MongoSessionRepository";
import { InMemoryInstallationRepository } from "./infrastructure/InMemoryInstallationRepository";
import { MongoInstallationRepository } from "./infrastructure/MongoInstallationRepository";

const database = getDatabase();
export const sessionRepository = database
  ? new MongoSessionRepository(database)
  : new InMemorySessionRepository();
const installationRepository = database
  ? new MongoInstallationRepository(database)
  : new InMemoryInstallationRepository();

const service = new AuthService(sessionRepository, userRepository, installationRepository);
const controller = new AuthController(service);

export default createAuthRoutes(controller);
