import { MeditationPreset, MeditationSession } from "../../../shared/domain/entities";

export type MeditationPresetEntity = MeditationPreset;
export type MeditationSessionEntity = MeditationSession;

export const supportedMeditationDurations = [5, 10, 15, 20] as const;
