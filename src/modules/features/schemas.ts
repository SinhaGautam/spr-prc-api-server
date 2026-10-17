import { z } from "zod";

export const featureSchema = z.object({
  key: z.string().min(1),
  isActive: z.boolean(),
}).strict();

export const featuresResponseSchema = z.object({
  features: z.array(featureSchema),
}).strict();

export type FeatureResponse = z.infer<typeof featureSchema>;
export type FeaturesResponse = z.infer<typeof featuresResponseSchema>;
