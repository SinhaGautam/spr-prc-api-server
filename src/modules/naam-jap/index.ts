import { NaamJapController } from "./controllers/NaamJapController";
import { NaamJapService } from "./application/NaamJapService";
import { InMemoryNaamJapRepository } from "./infrastructure/InMemoryNaamJapRepository";
import { createNaamJapRoutes } from "./routes";

const repository = new InMemoryNaamJapRepository();
const service = new NaamJapService(repository);
const controller = new NaamJapController(service);

export { service as naamJapService };
export default createNaamJapRoutes(controller);
