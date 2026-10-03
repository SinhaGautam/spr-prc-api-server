import type { z } from "zod";

export type RequestSchema<T extends z.ZodTypeAny> = T;
export type InferRequest<T extends z.ZodTypeAny> = z.infer<T>;
export type ResponseSchema<T extends z.ZodTypeAny> = T;
export type InferResponse<T extends z.ZodTypeAny> = z.infer<T>;
