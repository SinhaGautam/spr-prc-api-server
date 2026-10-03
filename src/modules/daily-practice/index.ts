import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { DailyPracticeController } from "./controllers/DailyPracticeController";
import { DailyPracticeService } from "./application/DailyPracticeService";
import { InMemoryDailyPracticeRepository } from "./infrastructure/InMemoryDailyPracticeRepository";
import { MongoDailyPracticeRepository } from "./infrastructure/MongoDailyPracticeRepository";
import { createDailyPracticeRoutes } from "./routes";

const database = getDatabase();
const repository = database ? new MongoDailyPracticeRepository(database) : new InMemoryDailyPracticeRepository();
const service = new DailyPracticeService(repository);
const controller = new DailyPracticeController(service);

export { service as dailyPracticeService };
export default createDailyPracticeRoutes(controller);
