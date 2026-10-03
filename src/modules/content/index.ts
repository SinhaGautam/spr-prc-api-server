import { ContentService } from "./application/ContentService";
import { ContentController } from "./controllers/ContentController";
import { InMemoryContentRepository } from "./infrastructure/InMemoryContentRepository";
import { createContentRoutes } from "./routes";

const repository = new InMemoryContentRepository();
const service = new ContentService(repository);
const controller = new ContentController(service);

export { service as contentService };
export default createContentRoutes(controller);
