import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class TraditionEntity {
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
