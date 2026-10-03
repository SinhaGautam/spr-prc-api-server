import { HomeController } from "./controllers/HomeController";
import { HomeService } from "./application/HomeService";
import { dailyPracticeService } from "../daily-practice";
import { meditationService } from "../meditation";
import { naamJapService } from "../naam-jap";
import { createHomeRoutes } from "./routes";

const service = new HomeService(dailyPracticeService, meditationService, naamJapService);
const controller = new HomeController(service);

export default createHomeRoutes(controller);
