import { z } from "zod";

export const homeTodayResponseSchema = z.object({
  greeting: z.string(),
  dailyGoals: z.array(z.object({
    practice: z.enum(["naam_jap", "meditation"]),
    targetLabel: z.string(),
    progress: z.number(),
    complete: z.boolean(),
  })),
  defaultMantra: z.object({ id: z.string(), name: z.string(), text: z.string() }),
  meditationPreset: z.object({ id: z.string(), key: z.string().optional(), durationMinutes: z.number() }),
});
