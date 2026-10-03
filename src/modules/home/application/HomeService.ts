import { BaseApiService } from "../../../core/application/BaseApiService";
import type { DailyPracticeService } from "../../daily-practice/application/DailyPracticeService";
import type { MeditationService } from "../../meditation/application/MeditationService";
import type { NaamJapService } from "../../naam-jap/application/NaamJapService";

export class HomeService extends BaseApiService {
  constructor(
    private readonly dailyPracticeService: DailyPracticeService,
    private readonly meditationService: MeditationService,
    private readonly naamJapService: NaamJapService,
  ) { super(); }

  async getTodayView(userId: string) {
    return this.execute("home.getTodayView", async () => {
      const [goals, presets, mantras] = await Promise.all([
        this.dailyPracticeService.getGoalsToday(userId),
        this.meditationService.listPresets(),
        this.naamJapService.listMantras(),
      ]);
      const preset = presets.items.find((item) => item.durationMinutes === 15) ?? presets.items[0] ?? { id: "preset-15", durationMinutes: 15 };
      const mantra = mantras.items[0] ?? { id: "mantra-1", name: "Hari Naam", text: "Hare Krishna" };

      return {
        greeting: "May your practice be gentle and steady.",
        dailyGoals: goals.goals.map((goal) => ({
          practice: goal.practice,
          targetLabel: goal.target,
          progress: goal.progress,
          complete: goal.complete,
        })),
        defaultMantra: mantra,
        meditationPreset: preset,
      };
    }, { userId });
  }
}
