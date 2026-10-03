export interface CreateSessionRequest {
  provider: "mock" | "apple" | "google";
  subject: string;
  displayName?: string;
}
