/**
 * V1 API contract definitions used by the backend boilerplate.
 * These schemas align with the approved spec-v1 API surface and are kept small on purpose.
 */
import * as zod from "zod";

export const HealthCheckResponse = zod.object({
  status: zod.enum(["ok", "ready"]),
});

export const BootstrapResponse = zod.object({
  traditions: zod.array(
    zod.object({
      id: zod.string(),
      key: zod.string(),
      name: zod.string(),
      status: zod.enum(["active", "archived"]),
    }),
  ),
  focuses: zod.array(
    zod.object({
      id: zod.string(),
      key: zod.string(),
      name: zod.string(),
      traditionIds: zod.array(zod.string()),
      status: zod.enum(["active", "archived"]),
    }),
  ),
  practices: zod.array(zod.enum(["reading", "naam_jap", "meditation"])),
  meditationPresets: zod.array(
    zod.object({
      id: zod.string(),
      key: zod.string(),
      durationMinutes: zod.number().int().positive(),
      status: zod.enum(["active", "archived"]),
    }),
  ),
  languages: zod.array(zod.string()),
  reminderDefaults: zod.object({
    enabled: zod.boolean(),
    localTime: zod.string(),
  }),
});

export const UserPreferencesRequest = zod.object({
  traditionId: zod.string(),
  primaryFocusId: zod.string().optional(),
  enabledPractices: zod.array(zod.enum(["reading", "naam_jap", "meditation"])),
  naamJapTarget: zod.number().int().positive().optional(),
  meditationTargetMinutes: zod.number().int().positive().optional(),
  reminder: zod
    .object({
      enabled: zod.boolean(),
      localTime: zod.string().optional(),
    })
    .optional(),
});

export const DailyGoalSummary = zod.object({
  practice: zod.enum(["reading", "naam_jap", "meditation"]),
  target: zod.string(),
  progress: zod.number().min(0),
  complete: zod.boolean(),
});

export const ApiErrorResponse = zod.object({
  error: zod.object({
    code: zod.string(),
    message: zod.string(),
  }),
});
