import { z } from "zod";

export const createSessionRequestSchema = z.object({
  provider: z.enum(["mock", "apple", "google"]),
  subject: z.string().trim().min(1).max(255),
  displayName: z.string().trim().min(1).max(100).optional(),
});

export const authResponseSchema = z.object({
  session: z.object({
    token: z.string(),
    expiresAt: z.string().datetime(),
  }),
  user: z.object({
    id: z.string(),
    displayName: z.string(),
    provider: z.string(),
    status: z.enum(["active", "inactive", "suspended"]),
    timezone: z.string(),
    language: z.string(),
  }),
});
