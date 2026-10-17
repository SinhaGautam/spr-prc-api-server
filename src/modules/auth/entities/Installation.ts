export interface Installation {
  installationId: string;
  secretHash: string;
  userId: string;
  platform: "android" | "ios";
  appVersion?: string;
  osVersion?: string;
  deviceModel?: string;
  language: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt: Date;
}
