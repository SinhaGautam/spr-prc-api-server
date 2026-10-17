import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { dailyPracticeService } from "../daily-practice";
import { FeatureAvailabilityService } from "../features/application/FeatureAvailabilityService";
import { MongoFeaturesRepository } from "../features/infrastructure/MongoFeaturesRepository";
import { MeditationController } from "./controllers/MeditationController";
import { MeditationService } from "./application/MeditationService";
import { MongoMeditationRepository } from "./infrastructure/MongoMeditationRepository";
import { createMeditationRoutes } from "./routes";

const db = getDatabase();
const repository = new MongoMeditationRepository(db);
const featureAvailability = new FeatureAvailabilityService(new MongoFeaturesRepository(db));
const service = new MeditationService(repository, dailyPracticeService, featureAvailability);
const controller = new MeditationController(service);

export { service as meditationService };
export default createMeditationRoutes(controller);
