import { Song } from "../../../shared/domain/entities";

export type SongEntity = Song;

export const songPlaybackEventTypes = ["started", "resumed", "completed", "stopped"] as const;
