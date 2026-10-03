export class AuthRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "mock-auth" }];
  }
}
