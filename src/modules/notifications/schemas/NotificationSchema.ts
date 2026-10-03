import { z } from "zod";

export const updateReminderSchema = z.object({
  enabled: z.boolean(),
  localTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
});

export const registerDeviceSchema = z.object({
  token: z.string().trim().min(1).max(4096),
  platform: z.enum(["ios", "android"]),
});

export const deviceIdSchema = z.object({ deviceId: z.string().trim().min(1).max(255) });
