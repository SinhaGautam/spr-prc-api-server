import { PreferencesController } from "./controllers/PreferencesController";
import { PreferencesService } from "./application/PreferencesService";
import { InMemoryPreferencesRepository } from "./infrastructure/InMemoryPreferencesRepository";
import { createPreferencesRoutes } from "./routes";

const repository = new InMemoryPreferencesRepository();
const service = new PreferencesService(repository);
const controller = new PreferencesController(service);

export { service as preferencesService };
export default createPreferencesRoutes(controller);
