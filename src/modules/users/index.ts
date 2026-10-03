import router from "./routes";
import { UserController } from "./controllers/UserController";
import { InMemoryUserRepository } from "./infrastructure/InMemoryUserRepository";
import { UserService } from "./application/UserService";

const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = createUserRouter();

function createUserRouter() {
  return routerFactory(userController);
}

function routerFactory(controller: UserController) {
  return createUserRoutes(controller);
}

export default router;
