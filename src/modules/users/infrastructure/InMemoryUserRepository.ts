import type { UserRepository } from "../application/UserRepository";
import type { UserEntity } from "../entities/UserEntity";

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserEntity>([
    [
      "user-1",
      new UserEntity(
        "user-1",
        "mock",
        "mock-user-1",
        "Asia/Kolkata",
        "en",
        "active",
        "Seeker",
        "seeker@example.com",
      ),
    ],
  ]);

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) ?? null;
  }

  async findByAuth(
    authProvider: string,
    authSubject: string,
  ): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (
        user.authProvider === authProvider &&
        user.authSubject === authSubject
      ) {
        return user;
      }
    }

    return null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    this.users.set(String(user._id), user);
    return user;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    this.users.set(String(user._id), user);
    return user;
  }
}
