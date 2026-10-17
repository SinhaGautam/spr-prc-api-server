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
      const [goals, meditationEnabled, naamJapEnabled] = await Promise.all([
        this.dailyPracticeService.getGoalsToday(userId),
        this.meditationService.isEnabled(),
        this.naamJapService.isEnabled(),
      ]);
      const presets = meditationEnabled
        ? await this.meditationService.listPresets()
        : { items: [] as Array<{ id: string; key?: string; durationMinutes: number }> };
      const preset = presets.items.find((item) => item.durationMinutes === 15) ?? presets.items[0] ?? null;
      const availablePractices = new Set([
        ...(naamJapEnabled ? ["naam_jap"] : []),
        ...(meditationEnabled ? ["meditation"] : []),
      ]);

      return {
        greeting: "May your practice be gentle and steady.",
        dailyGoals: goals.goals.filter((goal) => availablePractices.has(goal.practice)).map((goal) => ({
          practice: goal.practice, targetLabel: goal.target, progress: goal.progress, complete: goal.complete,
        })),
        meditationPreset: preset,
      };
    }, { userId });
  }
}
