import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { PreferencesController } from "./controllers/PreferencesController";
import { MongoPreferencesRepository } from "./infrastructure/MongoPreferencesRepository";
import { createPreferencesRoutes } from "./routes";
import { PreferencesService } from "./application/PreferencesService";

const repository = new MongoPreferencesRepository(getDatabase());
const service = new PreferencesService(repository);
const controller = new PreferencesController(service);

export { service as preferencesService };
export default createPreferencesRoutes(controller);
