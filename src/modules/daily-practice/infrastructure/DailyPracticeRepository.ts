export class DailyPracticeRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "daily-practice" }];
  }
}
