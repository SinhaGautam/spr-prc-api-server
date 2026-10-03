export class UsersRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "users" }];
  }
}
