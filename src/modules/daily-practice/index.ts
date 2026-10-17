import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { preferencesService } from "../preferences";
import { DailyPracticeController } from "./controllers/DailyPracticeController";
import { DailyPracticeService } from "./application/DailyPracticeService";
import { MongoDailyPracticeRepository } from "./infrastructure/MongoDailyPracticeRepository";
import { createDailyPracticeRoutes } from "./routes";

const repository = new MongoDailyPracticeRepository(getDatabase());
const service = new DailyPracticeService(repository, preferencesService);
const controller = new DailyPracticeController(service);

export { service as dailyPracticeService };
export default createDailyPracticeRoutes(controller);
