import type { AuthenticatedPrincipal } from "../../middleware/auth";

export interface AuthorizationPolicy<TContext = void> {
  authorize(principal: AuthenticatedPrincipal, context: TContext): void | Promise<void>;
}
