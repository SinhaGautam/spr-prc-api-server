import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { preferencesService } from "../preferences";
import { DailyPracticeController } from "./controllers/DailyPracticeController";
import { DailyPracticeService } from "./application/DailyPracticeService";
import { InMemoryDailyPracticeRepository } from "./infrastructure/InMemoryDailyPracticeRepository";
import { MongoDailyPracticeRepository } from "./infrastructure/MongoDailyPracticeRepository";
import { createDailyPracticeRoutes } from "./routes";

const database = getDatabase();
const repository = database ? new MongoDailyPracticeRepository(database) : new InMemoryDailyPracticeRepository();
const service = new DailyPracticeService(repository, preferencesService);
const controller = new DailyPracticeController(service);

export { service as dailyPracticeService };
export default createDailyPracticeRoutes(controller);
