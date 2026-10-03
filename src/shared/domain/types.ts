export type ObjectId = string;

export type Practice = "reading" | "naam_jap" | "meditation";
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

export type Provenance = {
  kind: string;
  title?: string;
  author?: string;
  publication?: string;
  reference?: string;
  rightsNote?: string;
};

export type UserPreferencesTarget = {
  type: "daily_item";
};

export type UserPreferencesSnapshot = {
  type: "daily_item";
} | { repetitions: number } | { minutes: number };

export type MediaAssetType = "audio" | "image" | "document";
export type MediaAssetStatus = "ready" | "processing" | "failed";
