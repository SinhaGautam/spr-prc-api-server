import { FeaturesController } from "./controllers/FeaturesController";
import { FeaturesService } from "./application/FeaturesService";
import { createFeaturesRoutes } from "./routes";

const service = new FeaturesService();
const controller = new FeaturesController(service);

export default createFeaturesRoutes(controller);
