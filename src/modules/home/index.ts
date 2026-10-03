import { HomeController } from "./controllers/HomeController";
import { HomeService } from "./application/HomeService";
import { DailyPracticeService } from "../daily-practice/application/DailyPracticeService";
import { InMemoryDailyPracticeRepository } from "../daily-practice/infrastructure/InMemoryDailyPracticeRepository";
import { MeditationService } from "../meditation/application/MeditationService";
import { InMemoryMeditationRepository } from "../meditation/infrastructure/InMemoryMeditationRepository";
import { createHomeRoutes } from "./routes";

const dailyPracticeService = new DailyPracticeService(new InMemoryDailyPracticeRepository());
const meditationService = new MeditationService(new InMemoryMeditationRepository());
const service = new HomeService(dailyPracticeService, meditationService);
const controller = new HomeController(service);

export default createHomeRoutes(controller);
