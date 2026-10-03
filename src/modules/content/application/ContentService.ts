import { BaseApiService } from "../../../core/application/BaseApiService";
import type { ContentCatalogResponse } from "../contracts/ContentResponse";
import type { ContentRepository } from "./ContentRepository";

export class ContentService extends BaseApiService {
  constructor(private readonly repository: ContentRepository) { super(); }

  async getCatalog(): Promise<ContentCatalogResponse> {
    return this.execute("content.getCatalog", async () => {
      const [traditions, focuses, tags] = await Promise.all([
        this.repository.listTraditions(),
        this.repository.listFocuses(),
        this.repository.listTags(),
      ]);

      return {
        traditions: traditions.map((item) => ({ id: String(item._id), key: item.key, name: item.name })),
        focuses: focuses.map((item) => ({
          id: String(item._id), key: item.key, name: item.name, traditionIds: item.traditionIds.map(String),
        })),
        tags: tags.map((item) => ({ id: String(item._id), key: item.key, name: item.name, type: item.type })),
      };
    });
  }
}
