import { DailyPracticeController } from "./controllers/DailyPracticeController";
import { DailyPracticeService } from "./application/DailyPracticeService";
import { InMemoryDailyPracticeRepository } from "./infrastructure/InMemoryDailyPracticeRepository";
import { createDailyPracticeRoutes } from "./routes";

const repository = new InMemoryDailyPracticeRepository();
const service = new DailyPracticeService(repository);
const controller = new DailyPracticeController(service);

export { service as dailyPracticeService };
export default createDailyPracticeRoutes(controller);
