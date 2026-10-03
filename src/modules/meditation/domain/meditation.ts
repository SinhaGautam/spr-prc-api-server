import type { MeditationPresetEntity } from "../entities/MeditationPresetEntity";
import type { MeditationSessionEntity } from "../entities/MeditationSessionEntity";

export type MeditationPreset = MeditationPresetEntity;
export type MeditationSession = MeditationSessionEntity;

export const supportedMeditationDurations = [5, 10, 15, 20] as const;
