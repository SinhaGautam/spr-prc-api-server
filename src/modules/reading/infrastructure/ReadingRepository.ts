export class ReadingRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "reading" }];
  }
}
