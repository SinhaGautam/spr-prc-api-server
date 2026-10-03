import { z } from "zod";

export const createMeditationSessionSchema = z.object({
  presetId: z.string().trim().min(1).optional(),
  plannedMinutes: z.number().int().positive().max(180),
  actualSeconds: z.number().int().nonnegative().max(10800),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  completed: z.boolean(),
  completionReason: z.enum(["completed", "interrupted", "cancelled"]).optional(),
  clientSessionId: z.string().trim().min(1).max(255),
});

export const meditationPresetResponseSchema = z.array(z.object({
  id: z.string(), key: z.string(), durationMinutes: z.number(),
}));
