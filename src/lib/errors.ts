import type { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, statusCode = 500, details?: Record<string, unknown>) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required", details?: Record<string, unknown>) {
    super(message, "AUTHENTICATION_ERROR", 401, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Forbidden", details?: Record<string, unknown>) {
    super(message, "AUTHORIZATION_ERROR", 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "RESOURCE_NOT_FOUND", 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "RESOURCE_CONFLICT", 409, details);
  }
}

export class IdempotencyError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "IDEMPOTENCY_ERROR", 409, details);
  }
}

export class DependencyError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "DEPENDENCY_ERROR", 503, details);
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.id ?? "unknown";

  if (err instanceof AppError) {
    logger.warn(
      {
        requestId,
        route: req.originalUrl,
        method: req.method,
        statusCode: err.statusCode,
        errorCode: err.code,
        err,
      },
      "Handled application error",
    );

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        requestId,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  if (err instanceof Error) {
    logger.error(
      {
        requestId,
        route: req.originalUrl,
        method: req.method,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        err,
      },
      "Unexpected error",
    );

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected server error.",
        requestId,
      },
    });
  }

  logger.error(
    {
      requestId,
      route: req.originalUrl,
      method: req.method,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      err,
    },
    "Unexpected error",
  );

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error.",
      requestId,
    },
  });
}
