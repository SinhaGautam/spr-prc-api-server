export class FavoritesRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "favorites" }];
  }
}
