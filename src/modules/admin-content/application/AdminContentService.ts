import { BaseApiService } from "../../../core/application/BaseApiService";
import type { ContentItemEntity } from "../entities/ContentItemEntity";
import type { AdminContentRepository } from "./AdminContentRepository";

export class AdminContentService extends BaseApiService {
  constructor(private readonly repository: AdminContentRepository) { super(); }

  async save(item: ContentItemEntity): Promise<ContentItemEntity> {
    return this.execute("adminContent.save", () => this.repository.save(item), { contentId: item.id });
  }

  async findById(id: string): Promise<ContentItemEntity | null> {
    return this.execute("adminContent.findById", () => this.repository.findById(id), { contentId: id });
  }
}
