import type { NextFunction, Request, Response } from "express";
import { logger } from "../core/logging/Logger";
import { failure } from "../core/http/ApiResponse";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 500,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
export class ValidationError extends AppError { constructor(message = "Request validation failed", details?: Record<string, unknown>) { super(message, "VALIDATION_ERROR", 400, details); } }
export class AuthenticationError extends AppError { constructor(message = "Authentication required") { super(message, "AUTHENTICATION_ERROR", 401); } }
export class AuthorizationError extends AppError { constructor(message = "Forbidden") { super(message, "AUTHORIZATION_ERROR", 403); } }
export class NotFoundError extends AppError { constructor(message: string) { super(message, "RESOURCE_NOT_FOUND", 404); } }
export class ConflictError extends AppError { constructor(message: string) { super(message, "RESOURCE_CONFLICT", 409); } }
export class IdempotencyError extends AppError { constructor(message: string) { super(message, "IDEMPOTENCY_ERROR", 409); } }
export class DependencyError extends AppError { constructor(message: string) { super(message, "DEPENDENCY_ERROR", 503); } }

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  const requestId = req.id ?? "unknown";
  const appError = err instanceof AppError ? err : undefined;
  const statusCode = appError?.statusCode ?? 500;
  const code = appError?.code ?? "INTERNAL_SERVER_ERROR";
  const message = appError?.message ?? "Unexpected server error.";

  if (appError) {
    logger.warn({ requestId, route: req.originalUrl, method: req.method, statusCode, errorCode: code }, "Handled application error");
  } else {
    logger.error({ requestId, route: req.originalUrl, method: req.method, statusCode, errorCode: code, err }, "Unexpected error");
  }

  res.status(statusCode).json(failure({ code, message, requestId }));
}
