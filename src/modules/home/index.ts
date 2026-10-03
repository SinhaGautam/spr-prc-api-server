import { HomeController } from "./controllers/HomeController";
import { HomeService } from "./application/HomeService";
import { dailyPracticeService } from "../daily-practice";
import { meditationService } from "../meditation";
import { createHomeRoutes } from "./routes";

const service = new HomeService(dailyPracticeService, meditationService);
const controller = new HomeController(service);

export default createHomeRoutes(controller);
