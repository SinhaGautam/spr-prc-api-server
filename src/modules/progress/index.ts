import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { ProgressController } from "./controllers/ProgressController";
import { MongoProgressRepository } from "./infrastructure/MongoProgressRepository";
import { ProgressService } from "./application/ProgressService";
import { createProgressRoutes } from "./routes";

const repository = new MongoProgressRepository(getDatabase());
const service = new ProgressService(repository);
const controller = new ProgressController(service);

export default createProgressRoutes(controller);
