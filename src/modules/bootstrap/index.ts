import { BootstrapController } from "./controllers/BootstrapController";
import { BootstrapService } from "./application/BootstrapService";
import { contentService } from "../content";
import { meditationService } from "../meditation";
import { naamJapService } from "../naam-jap";
import { createBootstrapRoutes } from "./routes";

const service = new BootstrapService(contentService, meditationService, naamJapService);
const controller = new BootstrapController(service);

export default createBootstrapRoutes(controller);
