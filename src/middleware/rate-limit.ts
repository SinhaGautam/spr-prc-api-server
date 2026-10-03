import type { Request, Response, NextFunction } from "express";

interface RateLimitState {
  count: number;
  resetAt: number;
}

const bucketMap = new Map<string, RateLimitState>();

export function rateLimitMiddleware({
  windowMs = 60000,
  maxRequests = 120,
}: { windowMs?: number; maxRequests?: number } = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identity = `${req.ip ?? "unknown"}:${req.path}`;
    const now = Date.now();
    const bucket = bucketMap.get(identity);

    if (!bucket || bucket.resetAt <= now) {
      bucketMap.set(identity, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;

    if (bucket.count > maxRequests) {
      return res.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later.",
          requestId: req.id,
        },
      });
    }

    return next();
  };
}
