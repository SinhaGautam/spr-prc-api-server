import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class MeditationPresetEntity {
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
