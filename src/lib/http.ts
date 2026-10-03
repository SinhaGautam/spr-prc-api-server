import type { Response } from "express";

export function ok(res: Response, payload: unknown) {
  res.status(200).json(payload);
}

export function created(res: Response, payload: unknown) {
  res.status(201).json(payload);
}

export function notImplemented(res: Response, feature: string) {
  res.status(501).json({
    error: {
      code: "NOT_IMPLEMENTED",
      message: `${feature} is not implemented in the V1 boilerplate yet.`,
    },
  });
}
