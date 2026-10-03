import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class TagEntity {
  constructor(
    public readonly _id: ObjectId,
    public readonly key: string,
    public readonly name: string,
    public readonly type: "theme" | "time" | "intent" | "festival",
    public readonly status: ContentStatus,
  ) {}
}
