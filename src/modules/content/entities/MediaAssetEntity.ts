import type { ObjectId } from "../../../shared/domain/types";

export class MediaAssetEntity {
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
