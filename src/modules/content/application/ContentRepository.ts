import type { FocusEntity } from "../entities/FocusEntity";
import type { TagEntity } from "../entities/TagEntity";
import type { TraditionEntity } from "../entities/TraditionEntity";

export interface ContentRepository {
  listTraditions(): Promise<TraditionEntity[]>;
  listFocuses(): Promise<FocusEntity[]>;
  listTags(): Promise<TagEntity[]>;
}
