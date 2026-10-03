export class HealthRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "health" }];
  }
}
