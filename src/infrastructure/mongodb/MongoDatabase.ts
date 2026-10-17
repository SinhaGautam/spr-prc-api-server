import { MongoClient, type Db } from "mongodb";
import { E } from "../../core/config/Environment";
import { logger } from "../../core/logging/Logger";
import { ensureDatabaseIndexes } from "./MongoIndexes";

let client: MongoClient | null = null;
let database: Db | null = null;

export async function connectDatabase(): Promise<void> {
  if (database) return;
  if (!E.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is required; refusing to start without MongoDB persistence");
  }

  client = new MongoClient(E.MONGO_DB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  try {
    await client.connect();
    database = client.db(E.MONGO_DB_NAME);
    await ensureDatabaseIndexes(database);
    logger.info({ database: E.MONGO_DB_NAME }, "MongoDB connection established");
  } catch (error) {
    await client.close().catch(() => undefined);
    client = null;
    database = null;
    throw error;
  }
}

export function getDatabase(): Db {
  if (!database) {
    throw new Error("MongoDB is not connected; call connectDatabase() before accessing repositories");
  }
  return database;
}

export async function closeDatabase(): Promise<void> {
  if (!client) return;
  await client.close();
  client = null;
  database = null;
  logger.info("MongoDB connection closed");
}
