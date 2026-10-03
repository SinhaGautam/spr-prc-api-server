export class SongsRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "songs" }];
  }
}
