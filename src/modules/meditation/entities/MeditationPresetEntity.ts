import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class MeditationPresetEntity {
  constructor(
    public readonly _id: ObjectId,
    public readonly key: string,
    public readonly durationMinutes: number,
    public readonly status: ContentStatus,
    public readonly sortOrder: number,
    public readonly startBellAssetId?: string,
    public readonly endBellAssetId?: string,
    public readonly ambientAssetId?: string,
  ) {}
}
