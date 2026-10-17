import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { UserController } from "./controllers/UserController";
import { MongoUserRepository } from "./infrastructure/MongoUserRepository";
import { createUserRoutes } from "./routes";
import { UserService } from "./application/UserService";

const userRepository = new MongoUserRepository(getDatabase());
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export { userRepository, userService };
export default createUserRoutes(userController);
