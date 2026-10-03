export type Practice = "naam_jap" | "meditation";

export class DailyGoalEntity {
  constructor(
    public readonly userId: string,
    public readonly date: string,
    public readonly enabledPractices: Practice[],
    public readonly naamJapTarget: number,
    public readonly meditationTargetMinutes: number,
    public readonly naamJapProgress: number = 0,
    public readonly meditationProgressMinutes: number = 0,
  ) {}

  get naamJapComplete(): boolean {
    return !this.enabledPractices.includes("naam_jap") || this.naamJapProgress >= this.naamJapTarget;
  }

  get meditationComplete(): boolean {
    return !this.enabledPractices.includes("meditation") || this.meditationProgressMinutes >= this.meditationTargetMinutes;
  }

  get allComplete(): boolean {
    return this.enabledPractices.length > 0 && this.naamJapComplete && this.meditationComplete;
  }
}
