import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { NaamJapController } from "./controllers/NaamJapController";
import { NaamJapService } from "./application/NaamJapService";
import { InMemoryNaamJapRepository } from "./infrastructure/InMemoryNaamJapRepository";
import { MongoNaamJapRepository } from "./infrastructure/MongoNaamJapRepository";
import { createNaamJapRoutes } from "./routes";

const database = getDatabase();
const repository = database ? new MongoNaamJapRepository(database) : new InMemoryNaamJapRepository();
const service = new NaamJapService(repository);
const controller = new NaamJapController(service);

export { service as naamJapService };
export default createNaamJapRoutes(controller);
