import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class MantraEntity {
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
