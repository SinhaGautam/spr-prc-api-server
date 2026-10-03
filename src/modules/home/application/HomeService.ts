import { logger } from "../../../lib/logger";

export class HomeService {
  async getTodayView() {
    try {
      const payload = {
        greeting: "May your practice be gentle and steady.",
        featuredReading: {
          id: "reading-1",
          title: "A quiet morning reflection",
          excerpt: "Let your heart be still and attentive to the divine name.",
        },
        dailyGoals: [
          { practice: "reading", targetLabel: "1 reading", progress: 0, complete: false },
          { practice: "naam_jap", targetLabel: "108 repetitions", progress: 32, complete: false },
          { practice: "meditation", targetLabel: "15 minutes", progress: 15, complete: true },
        ],
        defaultMantra: { id: "mantra-hari", name: "Hari Naam", text: "Hare Krishna" },
        meditationPreset: { id: "preset-15", durationMinutes: 15 },
      };

      logger.debug("Resolved home today view");
      return payload;
    } catch (error) {
      logger.error({ err: error }, "Failed to resolve home today view");
      throw error;
    }
  }
}
