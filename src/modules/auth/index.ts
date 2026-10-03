import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./application/AuthService";
import { sessionRepository } from "./infrastructure/InMemorySessionRepository";
import { InMemoryUserRepository } from "../users/infrastructure/InMemoryUserRepository";
import { MongoUserRepository } from "../users/infrastructure/MongoUserRepository";
import { createAuthRoutes } from "./routes";

const database = getDatabase();
const userRepository = database ? new MongoUserRepository(database) : new InMemoryUserRepository();
const service = new AuthService(sessionRepository, userRepository);
const controller = new AuthController(service);

export { sessionRepository };
export default createAuthRoutes(controller);
