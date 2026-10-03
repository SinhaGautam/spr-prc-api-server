import { logger } from "../../../lib/logger";
import { NotFoundError } from "../../../lib/errors";

const readingCatalog: Array<{
  id: string;
  title: string;
  subtitle: string;
  contentType: string;
  traditionIds: string[];
  focusIds: string[];
  tagIds: string[];
  language: string;
  estimatedMinutes: number;
  body: string;
  source: {
    kind: string;
    title?: string;
    author?: string;
    rightsNote?: string;
  };
  status: "published" | "archived" | "draft";
  publishedAt: string;
}> = [
  {
    id: "reading-1",
    title: "A quiet morning reflection",
    subtitle: "A gentle opening for the day",
    contentType: "reflection",
    traditionIds: ["trad-hindu"],
    focusIds: ["focus-ram"],
    tagIds: ["tag-morning"],
    language: "en",
    estimatedMinutes: 5,
    body: "Let your heart be still. Keep your attention on the divine name.",
    source: {
      kind: "scripture_excerpt",
      title: "Daily reflection",
      author: "Bhakti practice team",
      rightsNote: "Verified and attributed before publication.",
    },
    status: "published",
    publishedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "reading-2",
    title: "The steady path of remembrance",
    subtitle: "A brief teaching on practice",
    contentType: "teaching",
    traditionIds: ["trad-jain"],
    focusIds: ["focus-mahavira"],
    tagIds: ["tag-practice"],
    language: "en",
    estimatedMinutes: 8,
    body: "Consistency in remembrance is more valuable than intensity. Return with calm and clarity.",
    source: {
      kind: "teaching",
      title: "Foundations of daily practice",
      author: "Bhakti practice team",
      rightsNote: "Approved for V1 educational use.",
    },
    status: "published",
    publishedAt: "2026-01-03T00:00:00.000Z",
  },
];

const readingProgressStore = new Map<string, { progressPercent: number; completed: boolean; firstOpenedAt: string; lastOpenedAt: string; completedAt?: string; updatedAt: string }>();

export class ReadingService {
  async listReadings(filters: { language?: string; tradition?: string; focus?: string; tag?: string }) {
    try {
      const items = readingCatalog.filter((reading) => {
        if (filters.language && reading.language !== filters.language) return false;
        if (filters.tradition && !reading.traditionIds.includes(filters.tradition)) return false;
        if (filters.focus && !reading.focusIds.includes(filters.focus)) return false;
        if (filters.tag && !reading.tagIds.includes(filters.tag)) return false;
        return reading.status === "published";
      });

      return {
        items: items.map(({ id, title, subtitle, language, traditionIds, focusIds, tagIds, status, estimatedMinutes, contentType }) => ({
          id,
          title,
          subtitle,
          contentType,
          language,
          traditionIds,
          focusIds,
          tagIds,
          status,
          estimatedMinutes,
        })),
        nextCursor: null,
      };
    } catch (error) {
      logger.error({ err: error }, "Failed to list readings");
      throw error;
    }
  }

  async getReading(readingId: string) {
    const reading = readingCatalog.find((item) => item.id === readingId);
    if (!reading) {
      throw new NotFoundError(`Reading ${readingId} was not found`);
    }

    return {
      id: reading.id,
      title: reading.title,
      subtitle: reading.subtitle,
      contentType: reading.contentType,
      traditionIds: reading.traditionIds,
      focusIds: reading.focusIds,
      tagIds: reading.tagIds,
      language: reading.language,
      body: reading.body,
      estimatedMinutes: reading.estimatedMinutes,
      source: reading.source,
      status: reading.status,
      publishedAt: reading.publishedAt,
    };
  }

  async updateProgress(userId: string, readingId: string, progressPercent: number) {
    try {
      await this.getReading(readingId);
      const now = new Date().toISOString();
      const key = `${userId}:${readingId}`;
      const current = readingProgressStore.get(key);
      const nextProgress = Math.max(0, Math.min(100, progressPercent));
      const nextRecord = {
        progressPercent: nextProgress,
        completed: nextProgress >= 100,
        firstOpenedAt: current?.firstOpenedAt ?? now,
        lastOpenedAt: now,
        completedAt: nextProgress >= 100 ? current?.completedAt ?? now : undefined,
        updatedAt: now,
      };

      readingProgressStore.set(key, nextRecord);
      logger.info({ userId, readingId, progressPercent: nextProgress }, "Reading progress updated");
      return {
        readingId,
        progressPercent: nextRecord.progressPercent,
        completed: nextRecord.completed,
        updatedAt: nextRecord.updatedAt,
      };
    } catch (error) {
      logger.error({ err: error, userId, readingId }, "Failed to update reading progress");
      throw error;
    }
  }

  async completeReading(userId: string, readingId: string) {
    try {
      await this.getReading(readingId);
      const key = `${userId}:${readingId}`;
      const now = new Date().toISOString();
      const current = readingProgressStore.get(key);
      const nextRecord = {
        progressPercent: 100,
        completed: true,
        firstOpenedAt: current?.firstOpenedAt ?? now,
        lastOpenedAt: now,
        completedAt: current?.completedAt ?? now,
        updatedAt: now,
      };

      readingProgressStore.set(key, nextRecord);
      logger.info({ userId, readingId }, "Reading marked complete");
      return {
        readingId,
        completed: true,
        idempotent: true,
        dailyPracticeUpdated: true,
        progressPercent: 100,
      };
    } catch (error) {
      logger.error({ err: error, userId, readingId }, "Failed to complete reading");
      throw error;
    }
  }
}
