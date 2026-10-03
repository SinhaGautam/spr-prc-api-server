import { logger } from "../../../lib/logger";
import { NotFoundError } from "../../../lib/errors";

const songsCatalog: Array<{
  id: string;
  title: string;
  language: string;
  traditionIds: string[];
  focusIds: string[];
  tagIds: string[];
  status: string;
  durationSeconds: number;
  audioUrl: string;
  artworkUrl: string;
}> = [
  {
    id: "song-1",
    title: "Shiv Shankara",
    language: "hi",
    traditionIds: ["trad-hindu"],
    focusIds: ["focus-ram"],
    tagIds: ["tag-morning"],
    status: "published",
    durationSeconds: 240,
    audioUrl: "https://cdn.example.com/audio/shiv-shankara.mp3",
    artworkUrl: "https://cdn.example.com/images/shiv-shankara.jpg",
  },
];

export class SongsService {
  async listSongs(filters: { language?: string; tradition?: string; focus?: string; tag?: string }) {
    try {
      const items = songsCatalog.filter((song) => {
        if (filters.language && song.language !== filters.language) return false;
        if (filters.tradition && !song.traditionIds.includes(filters.tradition)) return false;
        if (filters.focus && !song.focusIds.includes(filters.focus)) return false;
        if (filters.tag && !song.tagIds.includes(filters.tag)) return false;
        return song.status === "published";
      });

      return { items, nextCursor: null };
    } catch (error) {
      logger.error({ err: error }, "Failed to list songs");
      throw error;
    }
  }

  async getSong(songId: string) {
    try {
      const song = songsCatalog.find((item) => item.id === songId);
      if (!song) {
        throw new NotFoundError(`Song ${songId} was not found`);
      }

      return song;
    } catch (error) {
      logger.error({ err: error, songId }, "Failed to load song");
      throw error;
    }
  }

  async recordPlaybackEvent(songId: string, type: "started" | "resumed" | "completed" | "stopped") {
    try {
      logger.info({ songId, eventType: type }, "Song playback event received");
      return { songId, eventType: type, receivedAt: new Date().toISOString() };
    } catch (error) {
      logger.error({ err: error, songId, eventType: type }, "Failed to record playback event");
      throw error;
    }
  }
}
