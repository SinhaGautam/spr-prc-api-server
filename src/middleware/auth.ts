import type { NextFunction, Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../lib/errors";
import { sessionRepository } from "../modules/auth/repositories";

export interface AuthenticatedPrincipal {
  userId: string;
  authProvider: string;
  roles: string[];
}

export async function authenticationMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      req.user = undefined;
      next();
      return;
    }

    const match = /^Bearer\s+([^\s]+)$/i.exec(authHeader);
    if (!match) {
      next(new AuthenticationError("Invalid authorization header"));
      return;
    }

    const session = await sessionRepository.findByToken(match[1]);
    if (!session) {
      next(new AuthenticationError("Authentication failed"));
      return;
    }

    req.user = { userId: session.userId, authProvider: "installation", roles: ["user"] };
    next();
  } catch (error) {
    next(error);
  }
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
