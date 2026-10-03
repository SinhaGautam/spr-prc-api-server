import type { UserRepository } from "../application/UserRepository";
import type { UserEntity } from "../entities/UserEntity";

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserEntity>([
    [
      "user-1",
      new UserEntity(
        "user-1",
        "Seeker",
        "seeker@example.com",
        "Asia/Kolkata",
        "en",
        "active",
      ),
    ],
  ]);

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) ?? null;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    this.users.set(user.id, user);
    return user;
  }
}
