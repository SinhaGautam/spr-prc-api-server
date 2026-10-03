import { z } from "zod";

export const updatePreferencesSchema = z.object({
  traditionId: z.string().trim().min(1).max(100),
  primaryFocusId: z.string().trim().min(1).max(100).optional(),
  enabledPractices: z.array(z.enum(["naam_jap", "meditation"])).min(1).max(2),
  naamJapTarget: z.number().int().positive().max(100000).optional(),
  meditationTargetMinutes: z.number().int().positive().max(180).optional(),
  reminder: z.object({
    enabled: z.boolean(),
    localTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  }).optional(),
});

export const preferencesResponseSchema = z.object({
  userId: z.string(),
  traditionId: z.string(),
  primaryFocusId: z.string().optional(),
  enabledPractices: z.array(z.enum(["naam_jap", "meditation"])),
  naamJapTarget: z.number().optional(),
  meditationTargetMinutes: z.number().optional(),
  reminder: z.object({ enabled: z.boolean(), localTime: z.string() }),
});
