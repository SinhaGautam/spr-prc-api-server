import type {
  ContentStatus,
  ObjectId,
  Practice,
  ReminderConfig,
  Timestamped,
  UserStatus,
} from "./types";

export class User {
  constructor(
    public readonly _id: ObjectId,
    public authProvider: string,
    public authSubject: string,
    public timezone: string,
    public language: string,
    public status: UserStatus,
    public displayName?: string,
    public email?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class UserPreferences implements Timestamped {
  constructor(
    public readonly _id: ObjectId,
    public readonly userId: ObjectId,
    public traditionId: ObjectId,
    public enabledPractices: Practice[],
    public language: string,
    public reminder: ReminderConfig,
    public primaryFocusId?: ObjectId,
    public naamJapTarget?: { repetitions: number },
    public meditationTarget?: { minutes: number },
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class Tradition {
  constructor(
    public readonly _id: ObjectId,
    public key: string,
    public name: string,
    public status: ContentStatus,
    public sortOrder: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class Focus {
  constructor(
    public readonly _id: ObjectId,
    public key: string,
    public name: string,
    public traditionIds: ObjectId[],
    public status: ContentStatus,
    public sortOrder: number,
    public aliases?: string[],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class Tag {
  constructor(
    public readonly _id: ObjectId,
    public key: string,
    public name: string,
    public type: "theme" | "time" | "intent" | "festival",
    public status: ContentStatus,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class Mantra {
  constructor(
    public readonly _id: ObjectId,
    public name: string,
    public text: string,
    public traditionIds: ObjectId[],
    public focusIds: ObjectId[],
    public language: string,
    public status: ContentStatus,
    public transliteration?: string,
    public pronunciationNote?: string,
    public meaning?: string,
    public audioAssetId?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class NaamJapSession {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public targetRepetitions: number,
    public completedRepetitions: number,
    public startedAt: Date,
    public durationSeconds: number,
    public completed: boolean,
    public clientSessionId: string,
    public mantraId?: ObjectId,
    public mantraTextSnapshot?: string,
    public endedAt?: Date,
    public readonly createdAt: Date = new Date(),
  ) {}
}

export class MeditationPreset {
  constructor(
    public readonly _id: ObjectId,
    public key: string,
    public durationMinutes: number,
    public status: ContentStatus,
    public sortOrder: number,
    public startBellAssetId?: string,
    public endBellAssetId?: string,
    public ambientAssetId?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class MeditationSession {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public plannedMinutes: number,
    public actualSeconds: number,
    public startedAt: Date,
    public completed: boolean,
    public clientSessionId: string,
    public presetId?: ObjectId,
    public endedAt?: Date,
    public completionReason?: "completed" | "interrupted" | "cancelled",
    public readonly createdAt: Date = new Date(),
  ) {}
}

export class DailyGoalSnapshot {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public date: string,
    public enabledPractices: Practice[],
    public naamJapComplete: boolean,
    public meditationComplete: boolean,
    public allComplete: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class MediaAsset {
  constructor(
    public readonly _id: ObjectId,
    public type: "audio" | "image" | "document",
    public storageKey: string,
    public cdnUrl: string,
    public mimeType: string,
    public sizeBytes: number,
    public status: "ready" | "processing" | "failed",
    public durationSeconds?: number,
    public checksum?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class DeviceRegistration {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public token: string,
    public platform: "ios" | "android",
    public readonly createdAt: Date = new Date(),
  ) {}
}
