import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { preferencesService } from "../preferences";
import { FeatureAvailabilityService } from "../features/application/FeatureAvailabilityService";
import { MongoFeaturesRepository } from "../features/infrastructure/MongoFeaturesRepository";
import { DailyPracticeController } from "./controllers/DailyPracticeController";
import { DailyPracticeService } from "./application/DailyPracticeService";
import { MongoDailyPracticeRepository } from "./infrastructure/MongoDailyPracticeRepository";
import { createDailyPracticeRoutes } from "./routes";

const db = getDatabase();
const repository = new MongoDailyPracticeRepository(db);
const featureAvailability = new FeatureAvailabilityService(new MongoFeaturesRepository(db));
const service = new DailyPracticeService(repository, preferencesService, featureAvailability);
const controller = new DailyPracticeController(service);

export { service as dailyPracticeService };
export default createDailyPracticeRoutes(controller);
