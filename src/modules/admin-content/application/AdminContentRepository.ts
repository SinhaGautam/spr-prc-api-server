import type { ContentItemEntity } from "../entities/ContentItemEntity";

export interface AdminContentRepository {
  save(item: ContentItemEntity): Promise<ContentItemEntity>;
  findById(id: string): Promise<ContentItemEntity | null>;
}
