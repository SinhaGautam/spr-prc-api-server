export class PreferencesRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "preferences" }];
  }
}
