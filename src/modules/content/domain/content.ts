import { Focus, Reading, Tag, Tradition } from "../../../shared/domain/entities";

export type TraditionEntity = Tradition;
export type FocusEntity = Focus;
export type TagEntity = Tag;
export type ContentEntity = Reading;

export const contentTypes = [
  "scripture_excerpt",
  "prayer",
  "reflection",
  "story",
  "teaching",
] as const;
