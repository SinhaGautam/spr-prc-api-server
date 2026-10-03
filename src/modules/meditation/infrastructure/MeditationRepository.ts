export class MeditationRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "meditation" }];
  }
}
