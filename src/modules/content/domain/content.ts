import type { FocusEntity } from "../entities/FocusEntity";
import type { TagEntity } from "../entities/TagEntity";
import type { TraditionEntity } from "../entities/TraditionEntity";

export type Tradition = TraditionEntity;
export type Focus = FocusEntity;
export type Tag = TagEntity;

export type ContentEntity = {
  id: string;
  title: string;
  status: "published" | "archived" | "draft";
  traditionIds: string[];
  focusIds: string[];
  tagIds: string[];
  language: string;
};
