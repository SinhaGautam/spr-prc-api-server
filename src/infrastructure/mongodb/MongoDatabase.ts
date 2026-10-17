import { MongoClient, type Db } from "mongodb";
import { E } from "../../core/config/Environment";
import { logger } from "../../core/logging/Logger";
import { ensureDatabaseIndexes } from "./MongoIndexes";

let client: MongoClient | null = null;
let database: Db | null = null;

export async function connectDatabase(): Promise<void> {
  if (!E.MONGO_DB_URI) {
    logger.warn("MongoDB is not configured; running without database connectivity");
    return;
  }
  if (client && database) return;

  client = new MongoClient(E.MONGO_DB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  await client.connect();
  database = client.db(E.MONGO_DB_NAME);
  await ensureDatabaseIndexes(database);
  logger.info({ database: E.MONGO_DB_NAME }, "MongoDB connection established");
}

export function getDatabase(): Db | null {
  return database;
}

export async function closeDatabase(): Promise<void> {
  if (!client) return;
  await client.close();
  client = null;
  database = null;
  logger.info("MongoDB connection closed");
}
