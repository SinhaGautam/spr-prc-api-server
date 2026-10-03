import { BootstrapController } from "./controllers/BootstrapController";
import { BootstrapService } from "./application/BootstrapService";
import { InMemoryContentRepository } from "../content/infrastructure/InMemoryContentRepository";
import { InMemoryMeditationRepository } from "../meditation/infrastructure/InMemoryMeditationRepository";
import { ContentService } from "../content/application/ContentService";
import { MeditationService } from "../meditation/application/MeditationService";
import { createBootstrapRoutes } from "./routes";

const contentService = new ContentService(new InMemoryContentRepository());
const meditationService = new MeditationService(new InMemoryMeditationRepository());
const service = new BootstrapService(contentService, meditationService);
const controller = new BootstrapController(service);

export default createBootstrapRoutes(controller);
