import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

const requestIdPattern = /^[A-Za-z0-9._:-]{1,128}$/;

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.get("x-request-id")?.trim();
  const requestId = incoming && requestIdPattern.test(incoming) ? incoming : randomUUID();

  req.id = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}
