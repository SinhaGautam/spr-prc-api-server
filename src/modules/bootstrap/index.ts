import { BootstrapController } from "./controllers/BootstrapController";
import { BootstrapService } from "./application/BootstrapService";
import { contentService } from "../content";
import { meditationService } from "../meditation";
import { createBootstrapRoutes } from "./routes";

const service = new BootstrapService(contentService, meditationService);
const controller = new BootstrapController(service);

export default createBootstrapRoutes(controller);
