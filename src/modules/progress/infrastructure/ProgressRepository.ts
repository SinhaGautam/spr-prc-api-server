export class ProgressRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "progress" }];
  }
}
