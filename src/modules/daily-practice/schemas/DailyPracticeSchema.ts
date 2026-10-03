import { z } from "zod";

export const historyQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
});

export const dailyGoalsResponseSchema = z.object({
  date: z.string(),
  enabledPractices: z.array(z.enum(["naam_jap", "meditation"])),
  goals: z.array(z.object({
    practice: z.enum(["naam_jap", "meditation"]),
    target: z.string(),
    progress: z.number(),
    complete: z.boolean(),
  })),
  allComplete: z.boolean(),
});

export const dailyProgressResponseSchema = z.object({
  date: z.string(),
  completed: z.boolean(),
  breakdown: z.object({ naam_jap: z.boolean(), meditation: z.boolean() }),
});
