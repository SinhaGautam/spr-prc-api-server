import { ProgressController } from "./controllers/ProgressController";
import { InMemoryProgressRepository } from "./infrastructure/InMemoryProgressRepository";
import { ProgressService } from "./application/ProgressService";
import { createProgressRoutes } from "./routes";

const repository = new InMemoryProgressRepository();
const service = new ProgressService(repository);
const controller = new ProgressController(service);

export default createProgressRoutes(controller);
