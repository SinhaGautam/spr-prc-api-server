import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { FeaturesService } from "./application/FeaturesService";
import { FeaturesController } from "./controllers/FeaturesController";
import { MongoFeaturesRepository } from "./infrastructure/MongoFeaturesRepository";
import { createFeaturesRoutes } from "./routes";

const repository = new MongoFeaturesRepository(getDatabase());
const service = new FeaturesService(repository);
const controller = new FeaturesController(service);

export default createFeaturesRoutes(controller);
