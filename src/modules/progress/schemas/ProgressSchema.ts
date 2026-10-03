import { z } from "zod";

export const progressHistoryQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
});

export const progressTodayResponseSchema = z.object({
  date: z.string(),
  completed: z.boolean(),
  naam_jap: z.boolean(),
  meditation: z.boolean(),
});

export const progressHistoryResponseSchema = z.object({
  month: z.string(),
  items: z.array(z.object({ date: z.string(), complete: z.boolean() })),
});

export const streakResponseSchema = z.object({
  current: z.number().int().nonnegative(),
  longest: z.number().int().nonnegative(),
});
