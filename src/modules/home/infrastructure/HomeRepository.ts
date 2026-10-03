export class HomeRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "home" }];
  }
}
