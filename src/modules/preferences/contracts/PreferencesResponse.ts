export interface PreferencesResponse {
  userId: string;
  traditionId: string;
  primaryFocusId?: string;
  enabledPractices: Array<"naam_jap" | "meditation">;
  naamJapTarget?: number;
  meditationTargetMinutes?: number;
  reminder: { enabled: boolean; localTime: string };
}
