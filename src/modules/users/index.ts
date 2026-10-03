import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { UserController } from "./controllers/UserController";
import { InMemoryUserRepository } from "./infrastructure/InMemoryUserRepository";
import { MongoUserRepository } from "./infrastructure/MongoUserRepository";
import { createUserRoutes } from "./routes";
import { UserService } from "./application/UserService";

const database = getDatabase();
const userRepository = database ? new MongoUserRepository(database) : new InMemoryUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export { userRepository, userService };
export default createUserRoutes(userController);
