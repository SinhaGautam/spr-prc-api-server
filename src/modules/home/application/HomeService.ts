import { BaseApiService } from "../../../core/application/BaseApiService";
import type { DailyPracticeService } from "../daily-practice/application/DailyPracticeService";
import type { MeditationService } from "../meditation/application/MeditationService";

export class HomeService extends BaseApiService {
  constructor(
    private readonly dailyPracticeService: DailyPracticeService,
    private readonly meditationService: MeditationService,
  ) { super(); }

  async getTodayView(_userId: string) {
    return this.execute("home.getTodayView", async () => {
      const goals = await this.dailyPracticeService.getGoalsToday(_userId);
      const presets = await this.meditationService.listPresets();
      return {
        greeting: "May your practice be gentle and steady.",
        dailyGoals: goals.goals,
        defaultMantra: { id: "mantra-1", name: "Hari Naam", text: "Hare Krishna" },
        meditationPreset: presets.items.find((item) => item.durationMinutes === 15) ?? presets.items[0] ?? { id: "preset-15", durationMinutes: 15 },
      };
    }, { userId: _userId });
  }
}
