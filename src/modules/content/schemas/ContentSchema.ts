import { z } from "zod";

export const contentCatalogResponseSchema = z.object({
  traditions: z.array(z.object({ id: z.string(), key: z.string(), name: z.string() })),
  focuses: z.array(z.object({ id: z.string(), key: z.string(), name: z.string(), traditionIds: z.array(z.string()) })),
  tags: z.array(z.object({ id: z.string(), key: z.string(), name: z.string(), type: z.string() })),
});
