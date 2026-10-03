import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";
import { ValidationError } from "../lib/errors";

export function validateRequest(schema: z.ZodTypeAny, source: "body" | "params" | "query" | "headers"): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new ValidationError("Request validation failed"));
    }
    req[source] = result.data;
    return next();
  };
}
