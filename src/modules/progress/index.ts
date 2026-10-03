import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { ProgressController } from "./controllers/ProgressController";
import { InMemoryProgressRepository } from "./infrastructure/InMemoryProgressRepository";
import { MongoProgressRepository } from "./infrastructure/MongoProgressRepository";
import { ProgressService } from "./application/ProgressService";
import { createProgressRoutes } from "./routes";

const database = getDatabase();
const repository = database ? new MongoProgressRepository(database) : new InMemoryProgressRepository();
const service = new ProgressService(repository);
const controller = new ProgressController(service);

export default createProgressRoutes(controller);
