import { z } from "zod";

export const updateUserRequestSchema = z.object({
  displayName: z.string().trim().min(1).max(100).optional(),
  email: z.string().email().optional(),
  timezone: z.string().trim().min(1).max(100),
  language: z.string().trim().min(2).max(10),
});

export const userProfileResponseSchema = z.object({
  id: z.string(),
  displayName: z.string().optional(),
  email: z.string().optional(),
  timezone: z.string(),
  language: z.string(),
  status: z.enum(["active", "inactive", "suspended"]),
});
