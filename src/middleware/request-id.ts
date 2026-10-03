import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.get("x-request-id");
  const requestId = incoming && incoming.trim().length > 0 ? incoming.trim() : randomUUID();

  req.id = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}
