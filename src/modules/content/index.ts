import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { ContentService } from "./application/ContentService";
import { ContentController } from "./controllers/ContentController";
import { InMemoryContentRepository } from "./infrastructure/InMemoryContentRepository";
import { MongoContentRepository } from "./infrastructure/MongoContentRepository";
import { createContentRoutes } from "./routes";

const database = getDatabase();
const repository = database ? new MongoContentRepository(database) : new InMemoryContentRepository();
const service = new ContentService(repository);
const controller = new ContentController(service);

export { service as contentService };
export default createContentRoutes(controller);
