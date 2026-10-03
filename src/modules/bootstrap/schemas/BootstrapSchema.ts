import { z } from "zod";

export const bootstrapResponseSchema = z.object({
  traditions: z.array(z.object({ id: z.string(), key: z.string(), name: z.string() })),
  focuses: z.array(z.object({ id: z.string(), key: z.string(), name: z.string(), traditionIds: z.array(z.string()) })),
  practices: z.tuple([z.literal("naam_jap"), z.literal("meditation")]),
  meditationPresets: z.array(z.object({ id: z.string(), key: z.string(), durationMinutes: z.number() })),
  languages: z.array(z.string()),
  reminderDefaults: z.object({ enabled: z.boolean(), localTime: z.string() }),
});
