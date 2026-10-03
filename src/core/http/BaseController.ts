import type { Response } from "express";
import type { ApiSuccess } from "./ApiResponse";

export abstract class BaseController {
  protected ok<T>(res: Response, data: T, meta?: Record<string, unknown>): void {
    const body: ApiSuccess<T> = { data, ...(meta ? { meta } : {}) };
    res.status(200).json(body);
  }

  protected created<T>(res: Response, data: T): void {
    const body: ApiSuccess<T> = { data };
    res.status(201).json(body);
  }

  protected noContent(res: Response): void {
    res.status(204).send();
  }
}
