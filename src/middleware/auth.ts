import type { NextFunction, Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../lib/errors";

export interface AuthenticatedPrincipal {
  userId: string;
  authProvider: string;
  roles: string[];
}

export function authenticationMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    req.user = undefined;
    return next();
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AuthenticationError("Invalid authorization header");
  }

  if (token === "mock-session-token") {
    req.user = {
      userId: "user-1",
      authProvider: "mock",
      roles: ["user"],
    } satisfies AuthenticatedPrincipal;
    return next();
  }

  throw new AuthenticationError("Authentication failed");
}

export function requireAuthentication(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new AuthenticationError();
  }

  next();
}

export function requireOwnership(req: Request, _res: Response, next: NextFunction) {
  const principal = req.user;
  const requestedUserId = req.params.userId ?? req.params.id;

  if (!principal || !requestedUserId || principal.userId !== requestedUserId) {
    throw new AuthorizationError("User does not have access to the requested resource");
  }

  next();
}
