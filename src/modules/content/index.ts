import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { ContentService } from "./application/ContentService";
import { ContentController } from "./controllers/ContentController";
import { MongoContentRepository } from "./infrastructure/MongoContentRepository";
import { createContentRoutes } from "./routes";

const repository = new MongoContentRepository(getDatabase());
const service = new ContentService(repository);
const controller = new ContentController(service);

export { service as contentService };
export default createContentRoutes(controller);
