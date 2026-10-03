import type { AdminContentRepository } from "../application/AdminContentRepository";
import type { ContentItemEntity } from "../entities/ContentItemEntity";

export class InMemoryAdminContentRepository implements AdminContentRepository {
  private readonly items = new Map<string, ContentItemEntity>();

  async save(item: ContentItemEntity): Promise<ContentItemEntity> {
    this.items.set(item.id, item);
    return item;
  }

  async findById(id: string): Promise<ContentItemEntity | null> {
    return this.items.get(id) ?? null;
  }
}
