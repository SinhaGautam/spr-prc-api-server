import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { dailyPracticeService } from "../daily-practice";
import { NaamJapController } from "./controllers/NaamJapController";
import { NaamJapService } from "./application/NaamJapService";
import { MongoNaamJapRepository } from "./infrastructure/MongoNaamJapRepository";
import { createNaamJapRoutes } from "./routes";

const repository = new MongoNaamJapRepository(getDatabase());
const service = new NaamJapService(repository, dailyPracticeService);
const controller = new NaamJapController(service);

export { service as naamJapService };
export default createNaamJapRoutes(controller);
