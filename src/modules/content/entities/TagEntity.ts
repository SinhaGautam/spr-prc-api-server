import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class TagEntity {
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
