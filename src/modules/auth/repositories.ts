import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { InMemorySessionRepository } from "./infrastructure/InMemorySessionRepository";
import { MongoSessionRepository } from "./infrastructure/MongoSessionRepository";
import { InMemoryInstallationRepository } from "./infrastructure/InMemoryInstallationRepository";
import { MongoInstallationRepository } from "./infrastructure/MongoInstallationRepository";

const database = getDatabase();

export const sessionRepository = database
  ? new MongoSessionRepository(database)
  : new InMemorySessionRepository();

export const installationRepository = database
  ? new MongoInstallationRepository(database)
  : new InMemoryInstallationRepository();
