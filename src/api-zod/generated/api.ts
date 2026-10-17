import * as zod from "zod";

export const Practice = zod.enum(["naam_jap", "meditation"]);

export const ApiErrorResponse = zod.object({
  error: zod.object({
    code: zod.string(),
    message: zod.string(),
    requestId: zod.string(),
  }),
});

export const UserPreferencesRequest = zod.object({
  traditionId: zod.string().trim().min(1).max(100),
  primaryFocusId: zod.string().trim().min(1).max(100).optional(),
  enabledPractices: zod.array(Practice).min(1).max(2),
  naamJapTarget: zod.number().int().positive().max(100000).optional(),
  meditationTargetMinutes: zod.number().int().positive().max(180).optional(),
  reminder: zod.object({
    enabled: zod.boolean(),
    localTime: zod.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  }).optional(),
});

export const DailyGoalSummary = zod.object({
  practice: Practice,
  target: zod.string(),
  progress: zod.number().min(0),
  complete: zod.boolean(),
});

export const BootstrapResponse = zod.object({
  traditions: zod.array(zod.object({ id: zod.string(), key: zod.string(), name: zod.string() })),
  focuses: zod.array(zod.object({ id: zod.string(), key: zod.string(), name: zod.string(), traditionIds: zod.array(zod.string()) })),
  tags: zod.array(zod.object({ id: zod.string(), key: zod.string(), name: zod.string(), type: zod.string() })),
  practices: zod.array(Practice),
  meditationPresets: zod.array(zod.object({ id: zod.string(), key: zod.string(), durationMinutes: zod.number() })),
  languages: zod.array(zod.string()),
  reminderDefaults: zod.object({ enabled: zod.boolean(), localTime: zod.string() }),
});
