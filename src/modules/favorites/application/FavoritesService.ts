import { logger } from "../../../lib/logger";

const favoritesStore = new Map<string, Array<{ entityType: "reading" | "song" | "mantra"; entityId: string; createdAt: string }>>();

export class FavoritesService {
  async listFavorites(userId: string, entityType?: "reading" | "song" | "mantra") {
    try {
      const items = favoritesStore.get(userId) ?? [];
      return {
        items: entityType ? items.filter((item) => item.entityType === entityType) : items,
      };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to list favorites");
      throw error;
    }
  }

  async addFavorite(userId: string, entityType: "reading" | "song" | "mantra", entityId: string) {
    try {
      const items = favoritesStore.get(userId) ?? [];
      const existing = items.find((item) => item.entityType === entityType && item.entityId === entityId);
      if (!existing) {
        const record = { entityType, entityId, createdAt: new Date().toISOString() };
        items.push(record);
        favoritesStore.set(userId, items);
      }

      logger.info({ userId, entityType, entityId }, "Favorite saved");
      return { entityType, entityId, favorited: true, createdAt: existing?.createdAt ?? new Date().toISOString() };
    } catch (error) {
      logger.error({ err: error, userId, entityType, entityId }, "Failed to add favorite");
      throw error;
    }
  }

  async removeFavorite(userId: string, entityType: "reading" | "song" | "mantra", entityId: string) {
    try {
      const items = favoritesStore.get(userId) ?? [];
      const filtered = items.filter((item) => !(item.entityType === entityType && item.entityId === entityId));
      favoritesStore.set(userId, filtered);
      logger.info({ userId, entityType, entityId }, "Favorite removed");
      return { entityType, entityId, removed: true };
    } catch (error) {
      logger.error({ err: error, userId, entityType, entityId }, "Failed to remove favorite");
      throw error;
    }
  }
}
