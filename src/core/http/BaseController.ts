import type { Response } from "express";
import { success } from "./ApiResponse";

export abstract class BaseController {
  protected ok<T>(res: Response, data: T): void {
    res.status(200).json(success(data));
  }

  protected created<T>(res: Response, data: T): void {
    res.status(201).json(success(data));
  }

  protected noContent(res: Response): void {
    res.status(204).send();
  }
}
