export class ContentRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "content" }];
  }
}
