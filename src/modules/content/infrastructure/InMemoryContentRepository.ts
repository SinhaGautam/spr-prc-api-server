import type { ContentRepository } from "../application/ContentRepository";
import { FocusEntity } from "../entities/FocusEntity";
import { TagEntity } from "../entities/TagEntity";
import { TraditionEntity } from "../entities/TraditionEntity";

export class InMemoryContentRepository implements ContentRepository {
  async listTraditions(): Promise<TraditionEntity[]> {
    return [
      new TraditionEntity("trad-hindu", "hindu", "Hindu", "published", 1),
      new TraditionEntity("trad-jain", "jain", "Jain", "published", 2),
    ];
  }

  async listFocuses(): Promise<FocusEntity[]> {
    return [
      new FocusEntity("focus-ram", "ram", "Ram", ["trad-hindu"], "published", 1),
      new FocusEntity("focus-krishna", "krishna", "Krishna", ["trad-hindu"], "published", 2),
      new FocusEntity("focus-mahavira", "mahavira", "Mahavira", ["trad-jain"], "published", 3),
    ];
  }

  async listTags(): Promise<TagEntity[]> {
    return [];
  }
}
