import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { dailyPracticeService } from "../daily-practice";
import { MeditationController } from "./controllers/MeditationController";
import { MeditationService } from "./application/MeditationService";
import { MongoMeditationRepository } from "./infrastructure/MongoMeditationRepository";
import { createMeditationRoutes } from "./routes";

const repository = new MongoMeditationRepository(getDatabase());
const service = new MeditationService(repository, dailyPracticeService);
const controller = new MeditationController(service);

export { service as meditationService };
export default createMeditationRoutes(controller);
