import { Reading, ReadingProgress } from "../../../shared/domain/entities";

export type ReadingEntity = Reading;
export type ReadingProgressEntity = ReadingProgress;

export const readingStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;
