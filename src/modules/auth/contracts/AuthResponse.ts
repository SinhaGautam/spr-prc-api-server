export interface AuthSessionResponse {
  token: string;
  expiresAt: string;
}

export interface AuthenticatedUserResponse {
  id: string;
  displayName: string;
  provider: string;
  status: "active" | "inactive" | "suspended";
  timezone: string;
  language: string;
}

export interface CreateSessionResponse {
  session: AuthSessionResponse;
  user: AuthenticatedUserResponse;
}
