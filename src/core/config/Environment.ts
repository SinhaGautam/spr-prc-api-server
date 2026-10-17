import { z } from "zod";
import { config } from "dotenv";

config({ path: ".env", override: false });

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  APP_NAME: z.string().trim().min(1).default("bhakti-api"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:19006"),
  MONGO_DB_URI: z.string().trim().min(1, "MONGO_DB_URI is required"),
  MONGO_DB_NAME: z.string().trim().optional(),
  AUTH_REQUIRED: z.coerce.boolean().default(false),
}).superRefine((value, ctx) => {
  if (value.NODE_ENV === "production" && !value.MONGO_DB_URI) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["MONGO_DB_URI"], message: "MONGO_DB_URI is required in production" });
  }
  if (/<MONGO_(USER|PASSWORD)>/.test(value.MONGO_DB_URI)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["MONGO_DB_URI"],
      message: "MONGO_DB_URI contains unresolved credentials; set MONGO_USER and MONGO_PASSWORD",
    });
  }
  if (value.CORS_ORIGINS.trim().length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["CORS_ORIGINS"], message: "CORS_ORIGINS must contain at least one origin" });
  }
});

const mongoDbUri = process.env.MONGO_DB_URI ?? process.env.MONGODB_URI ?? process.env.MONGO_URI;
const resolvedMongoDbUri = mongoDbUri
  ?.replaceAll("<MONGO_USER>", process.env.MONGO_USER ? encodeURIComponent(process.env.MONGO_USER) : "<MONGO_USER>")
  .replaceAll("<MONGO_PASSWORD>", process.env.MONGO_PASSWORD ? encodeURIComponent(process.env.MONGO_PASSWORD) : "<MONGO_PASSWORD>");

const parsedEnv = environmentSchema.safeParse({
  ...process.env,
  MONGO_DB_URI: resolvedMongoDbUri,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME ?? process.env.MONGODB_DATABASE,
});

if (!parsedEnv.success) {
  throw new Error(`Environment validation failed: ${parsedEnv.error.message}`);
}
export const E = parsedEnv.data;
export default E;
