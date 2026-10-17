import { getDatabase } from "../../infrastructure/mongodb/MongoDatabase";
import { MongoSessionRepository } from "./infrastructure/MongoSessionRepository";
import { MongoInstallationRepository } from "./infrastructure/MongoInstallationRepository";

// The server must connect to MongoDB before importing the auth module.
// There is deliberately no in-memory fallback: identity and sessions must survive restarts.
const database = getDatabase();

export const sessionRepository = new MongoSessionRepository(database);
export const installationRepository = new MongoInstallationRepository(database);
