import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { PreferencesController } from "./controllers/PreferencesController";
import { InMemoryPreferencesRepository } from "./infrastructure/InMemoryPreferencesRepository";
import { MongoPreferencesRepository } from "./infrastructure/MongoPreferencesRepository";
import { createPreferencesRoutes } from "./routes";
import { PreferencesService } from "./application/PreferencesService";

const database = getDatabase();
const repository = database ? new MongoPreferencesRepository(database) : new InMemoryPreferencesRepository();
const service = new PreferencesService(repository);
const controller = new PreferencesController(service);

export { service as preferencesService };
export default createPreferencesRoutes(controller);
