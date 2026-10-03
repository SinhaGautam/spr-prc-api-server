import { UserController } from "./controllers/UserController";
import { InMemoryUserRepository } from "./infrastructure/InMemoryUserRepository";
import { createUserRoutes } from "./routes";
import { UserService } from "./application/UserService";

const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export default createUserRoutes(userController);
