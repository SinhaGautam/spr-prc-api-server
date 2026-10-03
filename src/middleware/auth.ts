import type { NextFunction, Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../lib/errors";
import { sessionRepository } from "../modules/auth/infrastructure/InMemorySessionRepository";

export interface AuthenticatedPrincipal {
  userId: string;
  authProvider: string;
  roles: string[];
}

export async function authenticationMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    req.user = undefined;
    next();
    return;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    next(new AuthenticationError("Invalid authorization header"));
    return;
  }

  const session = await sessionRepository.findByToken(token);
  if (!session) {
    next(new AuthenticationError("Authentication failed"));
    return;
  }

  req.user = { userId: session.userId, authProvider: "mock", roles: ["user"] };
  next();
}

export function requireAuthentication(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new AuthenticationError());
    return;
  }
  next();
}

export function requireOwnership(req: Request, _res: Response, next: NextFunction): void {
  const principal = req.user;
  const requestedUserId = req.params.userId ?? req.params.id;
  if (!principal || !requestedUserId || principal.userId !== requestedUserId) {
    next(new AuthorizationError("User does not have access to the requested resource"));
    return;
  }
  next();
}
