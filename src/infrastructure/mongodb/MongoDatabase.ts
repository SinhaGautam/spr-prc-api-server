import { MongoClient, type Db } from "mongodb";
import { config } from "../../core/config/Environment";
import { logger } from "../../core/logging/Logger";

let client: MongoClient | null = null;
let database: Db | null = null;

export async function connectDatabase(): Promise<void> {
  if (!config.mongodbUri) {
    logger.warn("MongoDB is not configured; running without database connectivity");
    return;
  }

  if (client && database) return;

  client = new MongoClient(config.mongodbUri, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  await client.connect();
  database = client.db(config.mongodbDatabase);
  logger.info({ database: config.mongodbDatabase }, "MongoDB connection established");
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
