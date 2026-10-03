export interface UpdatePreferencesRequest {
  traditionId: string;
  primaryFocusId?: string;
  enabledPractices: Array<"naam_jap" | "meditation">;
  naamJapTarget?: number;
  meditationTargetMinutes?: number;
  reminder?: {
    enabled: boolean;
    localTime?: string;
  };
}
