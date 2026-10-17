export interface BootstrapResponse {
  traditions: Array<{ id: string; key: string; name: string }>;
  focuses: Array<{ id: string; key: string; name: string; traditionIds: string[] }>;
  practices: Array<"naam_jap" | "meditation">;
  meditationPresets: Array<{ id: string; key: string; durationMinutes: number }>;
  languages: string[];
  reminderDefaults: { enabled: boolean; localTime: string };
}
