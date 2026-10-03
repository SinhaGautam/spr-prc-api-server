import { MongoClient, type Db } from "mongodb";
import { config } from "../config/env";
import { ensureMongoIndexes } from "../infrastructure/mongodb/repositories";

let client: MongoClient | null = null;

export async function connectMongo(): Promise<MongoClient | null> {
  if (!config.mongodbUri) {
    return null;
  }

  if (client) {
    return client;
  }

  client = new MongoClient(config.mongodbUri, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  await client.connect();
  const db = getMongoDb();
  if (db) {
    await ensureMongoIndexes(db);
  }

  return client;
}

export function getMongoClient(): MongoClient | null {
  return client;
}

export function getMongoDb(): Db | null {
  if (!client || !config.mongodbDatabase) {
    return null;
  }

  return client.db(config.mongodbDatabase);
}

export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
