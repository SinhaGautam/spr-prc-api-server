export type ObjectId = string;

export type Practice = "naam_jap" | "meditation";
export type ContentStatus = "draft" | "published" | "archived";
export type UserStatus = "active" | "inactive" | "suspended";
export type ReminderConfig = {
  enabled: boolean;
  localTime: string;
};

export type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

export type UserPreferencesTarget = {
  type: "daily_item";
};

export type UserPreferencesSnapshot = { repetitions: number } | { minutes: number };

export type MediaAssetType = "audio" | "image" | "document";
export type MediaAssetStatus = "ready" | "processing" | "failed";
