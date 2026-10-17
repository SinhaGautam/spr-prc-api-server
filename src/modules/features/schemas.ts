import { z } from "zod";

export const featureFlagSchema = z.enum([
  "spr-naamjaap-enabled",
  "spr-meditation-enabled",
]);

export const featuresResponseSchema = z.object({
  features: z.array(featureFlagSchema),
}).strict();

export type FeaturesResponse = z.infer<typeof featuresResponseSchema>;
