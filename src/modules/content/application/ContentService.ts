import { logger } from "../../../lib/logger";

const contentCatalog = [
  {
    id: "content-1",
    title: "Daily reflection",
    status: "published",
    traditionIds: ["trad-hindu"],
    focusIds: ["focus-ram"],
    tagIds: ["tag-morning"],
    language: "en",
  },
];

export class ContentService {
  async listPublished() {
    try {
      return { items: contentCatalog };
    } catch (error) {
      logger.error({ err: error }, "Failed to load published content");
      throw error;
    }
  }
}
