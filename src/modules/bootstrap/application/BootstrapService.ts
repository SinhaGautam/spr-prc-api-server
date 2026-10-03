import { logger } from "../../../lib/logger";

export class BootstrapService {
  async getBootstrapData() {
    try {
      const payload = {
        traditions: [
          { id: "trad-hindu", key: "hindu", name: "Hindu", status: "active" },
          { id: "trad-jain", key: "jain", name: "Jain", status: "active" },
        ],
        focuses: [
          { id: "focus-ram", key: "ram", name: "Ram", traditionIds: ["trad-hindu"], status: "active" },
          { id: "focus-krishna", key: "krishna", name: "Krishna", traditionIds: ["trad-hindu"], status: "active" },
          { id: "focus-mahavira", key: "mahavira", name: "Mahavira", traditionIds: ["trad-jain"], status: "active" },
        ],
        practices: ["naam_jap", "meditation"],
        meditationPresets: [
          { id: "preset-5", key: "five_minutes", durationMinutes: 5, status: "active" },
          { id: "preset-10", key: "ten_minutes", durationMinutes: 10, status: "active" },
          { id: "preset-15", key: "fifteen_minutes", durationMinutes: 15, status: "active" },
          { id: "preset-20", key: "twenty_minutes", durationMinutes: 20, status: "active" },
        ],
        languages: ["en", "hi"],
        reminderDefaults: { enabled: false, localTime: "07:00" },
      };

      logger.debug("Bootstrapping onboarding catalog");
      return payload;
    } catch (error) {
      logger.error({ err: error }, "Failed to resolve bootstrap data");
      throw error;
    }
  }
}
