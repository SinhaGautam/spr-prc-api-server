export interface CreateSessionRequest {
  installationId: string;
  installationSecret: string;
  platform: "android" | "ios";
  appVersion?: string;
  osVersion?: string;
  deviceModel?: string;
  language?: string;
  timezone?: string;
  /** Reserved for V2; clients do not need to send this in V1. */
  displayName?: string;
}
