export interface LiveHealthResponse { status: "ok"; }
export interface ReadyHealthResponse { status: "ready" | "degraded"; checks: { api: "ok"; mongo: "ok" | "not_configured" | "unavailable" }; }
