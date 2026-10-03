import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class FocusEntity {
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
