import type { ContentStatus, ObjectId } from "../../../shared/domain/types";

export class FocusEntity {
  constructor(
    public readonly _id: ObjectId,
    public readonly key: string,
    public readonly name: string,
    public readonly traditionIds: ObjectId[],
    public readonly status: ContentStatus,
    public readonly sortOrder: number,
  ) {}
}
