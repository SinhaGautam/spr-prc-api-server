import { MeditationController } from "./controllers/MeditationController";
import { InMemoryMeditationRepository } from "./infrastructure/InMemoryMeditationRepository";
import { MeditationService } from "./application/MeditationService";
import { createMeditationRoutes } from "./routes";

const repository = new InMemoryMeditationRepository();
const service = new MeditationService(repository);
const controller = new MeditationController(service);

export { service as meditationService };
export default createMeditationRoutes(controller);
