import { Focus, Tag, Tradition } from "../../../shared/domain/entities";

export type TraditionEntity = Tradition;
export type FocusEntity = Focus;
export type TagEntity = Tag;

export type ContentEntity = {
  id: string;
  title: string;
  status: "published" | "archived" | "draft";
  traditionIds: string[];
  focusIds: string[];
  tagIds: string[];
  language: string;
};
