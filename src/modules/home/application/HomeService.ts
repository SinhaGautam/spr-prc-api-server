import { BaseApiService } from "../../../core/application/BaseApiService";
import type { DailyPracticeService } from "../../daily-practice/application/DailyPracticeService";
import type { MeditationService } from "../../meditation/application/MeditationService";

export class HomeService extends BaseApiService {
  constructor(
    private readonly dailyPracticeService: DailyPracticeService,
    private readonly meditationService: MeditationService,
  ) { super(); }

  async getTodayView(userId: string) {
    return this.execute("home.getTodayView", async () => {
      const goals = await this.dailyPracticeService.getGoalsToday(userId);
      const presets = await this.meditationService.listPresets();
      const preset = presets.items.find((item) => item.durationMinutes === 15) ?? presets.items[0] ?? { id: "preset-15", durationMinutes: 15 };
      return {
        greeting: "May your practice be gentle and steady.",
        dailyGoals: goals.goals.map((goal) => ({
          practice: goal.practice,
          targetLabel: goal.target,
          progress: goal.progress,
          complete: goal.complete,
        })),
        defaultMantra: { id: "mantra-1", name: "Hari Naam", text: "Hare Krishna" },
        meditationPreset: preset,
      };
    }, { userId });
  }
}
