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
  traditionId: zod.string().min(1),
  primaryFocusId: zod.string().optional(),
  enabledPractices: zod.array(Practice).min(1).max(2),
  naamJapTarget: zod.number().int().positive().optional(),
  meditationTargetMinutes: zod.number().int().positive().optional(),
  reminder: zod.object({
    enabled: zod.boolean(),
    localTime: zod.string().optional(),
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
  practices: zod.tuple([zod.literal("naam_jap"), zod.literal("meditation")]),
  meditationPresets: zod.array(zod.object({ id: zod.string(), key: zod.string(), durationMinutes: zod.number() })),
  languages: zod.array(zod.string()),
  reminderDefaults: zod.object({ enabled: zod.boolean(), localTime: zod.string() }),
});
