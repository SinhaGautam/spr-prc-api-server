import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { FeatureAvailabilityService } from "../features/application/FeatureAvailabilityService";
import { MongoFeaturesRepository } from "../features/infrastructure/MongoFeaturesRepository";
import { PreferencesController } from "./controllers/PreferencesController";
import { MongoPreferencesRepository } from "./infrastructure/MongoPreferencesRepository";
import { createPreferencesRoutes } from "./routes";
import { PreferencesService } from "./application/PreferencesService";

const db = getDatabase();
const repository = new MongoPreferencesRepository(db);
const featureAvailability = new FeatureAvailabilityService(new MongoFeaturesRepository(db));
const service = new PreferencesService(repository, featureAvailability);
const controller = new PreferencesController(service);

export { service as preferencesService };
export default createPreferencesRoutes(controller);
