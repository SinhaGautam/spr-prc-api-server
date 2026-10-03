import { z } from "zod";

export const createNaamJapSessionSchema = z.object({
  mantraId: z.string().trim().min(1).optional(),
  mantraText: z.string().trim().min(1).max(1000).optional(),
  targetRepetitions: z.number().int().positive().max(100000),
  completedRepetitions: z.number().int().min(0).max(100000),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  durationSeconds: z.number().int().nonnegative().max(86400),
  completed: z.boolean(),
  clientSessionId: z.string().trim().min(1).max(255),
});

export const mantraResponseSchema = z.object({
  items: z.array(z.object({ id: z.string(), name: z.string(), text: z.string(), language: z.string() })),
});

export const naamJapSessionResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  targetRepetitions: z.number(),
  completedRepetitions: z.number(),
  startedAt: z.string().datetime(),
  durationSeconds: z.number(),
  completed: z.boolean(),
  clientSessionId: z.string(),
  createdAt: z.string().datetime(),
  mantraId: z.string().optional(),
  mantraTextSnapshot: z.string().optional(),
  endedAt: z.string().datetime().optional(),
  idempotent: z.boolean().optional(),
});
