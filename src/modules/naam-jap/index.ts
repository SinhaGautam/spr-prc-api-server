import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { dailyPracticeService } from "../daily-practice";
import { FeatureAvailabilityService } from "../features/application/FeatureAvailabilityService";
import { MongoFeaturesRepository } from "../features/infrastructure/MongoFeaturesRepository";
import { NaamJapController } from "./controllers/NaamJapController";
import { NaamJapService } from "./application/NaamJapService";
import { MongoNaamJapRepository } from "./infrastructure/MongoNaamJapRepository";
import { createNaamJapRoutes } from "./routes";

const db = getDatabase();
const repository = new MongoNaamJapRepository(db);
const featureAvailability = new FeatureAvailabilityService(new MongoFeaturesRepository(db));
const service = new NaamJapService(repository, dailyPracticeService, featureAvailability);
const controller = new NaamJapController(service);

export { service as naamJapService };
export default createNaamJapRoutes(controller);
