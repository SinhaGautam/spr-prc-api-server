import { z } from "zod";

export const createSessionRequestSchema = z.object({
  installationId: z.string().uuid(),
  installationSecret: z.string().min(32).max(256),
  platform: z.enum(["android", "ios"]),
  appVersion: z.string().trim().min(1).max(50).optional(),
  osVersion: z.string().trim().min(1).max(100).optional(),
  deviceModel: z.string().trim().min(1).max(100).optional(),
  language: z.string().trim().min(2).max(35).optional(),
  timezone: z.string().trim().min(1).max(100).optional(),
  displayName: z.string().trim().min(1).max(100).optional(),
}).strict();

export const authResponseSchema = z.object({
  session: z.object({
    token: z.string().min(32),
    expiresAt: z.string().datetime(),
  }),
  user: z.object({
    id: z.string(),
    username: z.string(),
    displayName: z.string().optional(),
    provider: z.string(),
    status: z.enum(["active", "inactive", "suspended"]),
    timezone: z.string(),
    language: z.string(),
  }),
  installation: z.object({
    installationId: z.string().uuid(),
    platform: z.enum(["android", "ios"]),
    createdAt: z.string().datetime(),
  }),
});
