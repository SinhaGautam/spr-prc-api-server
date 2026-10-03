import { z } from "zod";

const mongoUser = process.env.MONGO_USER ?? process.env.MONGODB_USER ?? "";
const mongoPassword = process.env.MONGO_PASSWORD ?? process.env.MONGODB_PASSWORD ?? "";
const mongoUriTemplate = process.env.MONGO_URI ?? process.env.MONGODB_URI ?? "";
const resolvedMongoUri = mongoUriTemplate
  .replaceAll("<MONGO_USER>", encodeURIComponent(mongoUser))
  .replaceAll("<MONGO_PASSWORD>", encodeURIComponent(mongoPassword));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_NAME: z.string().default("bhakti-api"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:19006"),
  MONGO_URI: z.string().optional(),
  MONGO_DB_NAME: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  MONGODB_DATABASE: z.string().optional(),
  MONGO_USER: z.string().optional(),
  MONGO_PASSWORD: z.string().optional(),
  AUTH_REQUIRED: z.coerce.boolean().default(false),
});

export const env = envSchema.parse(process.env);

const mongoUri = resolvedMongoUri || env.MONGO_URI || env.MONGODB_URI;
const mongoDatabase = env.MONGO_DB_NAME || env.MONGODB_DATABASE || "bhakti_app";

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  appName: env.APP_NAME,
  logLevel: env.LOG_LEVEL,
  corsOrigins: env.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  mongodbUri: mongoUri,
  mongodbDatabase: mongoDatabase,
  authRequired: env.AUTH_REQUIRED,
};

export function getPort(): number {
  if (!Number.isFinite(config.port) || config.port <= 0) {
    throw new Error(`Invalid PORT value: "${String(process.env.PORT ?? config.port)}"`);
  }

  return config.port;
}
