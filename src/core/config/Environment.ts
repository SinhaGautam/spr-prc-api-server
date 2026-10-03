import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  APP_NAME: z.string().trim().min(1).default("bhakti-api"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:19006"),
  MONGODB_URI: z.string().trim().optional(),
  MONGODB_DATABASE: z.string().trim().optional(),
  AUTH_REQUIRED: z.coerce.boolean().default(false),
});

export type Environment = z.infer<typeof environmentSchema>;

export function loadEnvironment(source: NodeJS.ProcessEnv = process.env): Environment {
  return environmentSchema.parse(source);
}

export const environment = loadEnvironment();

export const config = {
  environment: environment.NODE_ENV,
  port: environment.PORT,
  appName: environment.APP_NAME,
  logLevel: environment.LOG_LEVEL,
  corsOrigins: environment.CORS_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean),
  mongodbUri: environment.MONGODB_URI,
  mongodbDatabase: environment.MONGODB_DATABASE ?? "bhakti_app",
  authRequired: environment.AUTH_REQUIRED,
} as const;
