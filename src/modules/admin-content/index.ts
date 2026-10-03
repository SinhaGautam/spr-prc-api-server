import { AdminContentService } from "./application/AdminContentService";
import { InMemoryAdminContentRepository } from "./infrastructure/InMemoryAdminContentRepository";

export const adminContentService = new AdminContentService(new InMemoryAdminContentRepository());
