import { BaseApiService } from "../../../core/application/BaseApiService";
import { NotFoundError } from "../../../lib/errors";
import type { UpdateUserRequest } from "../contracts/UserRequest";
import type { UserProfileResponse } from "../contracts/UserResponse";
import type { UserEntity } from "../entities/UserEntity";
import type { UserRepository } from "./UserRepository";

export class UserService extends BaseApiService {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async getProfile(userId: string): Promise<UserProfileResponse> {
    return this.execute(
      "users.getProfile",
      async () => {
        const user = await this.userRepository.findById(userId);

        if (!user) {
          throw new NotFoundError("User profile not found", { userId });
        }

        return this.toProfileResponse(user);
      },
      { userId },
    );
  }

  async updateProfile(
    userId: string,
    request: UpdateUserRequest,
  ): Promise<UserProfileResponse> {
    return this.execute(
      "users.updateProfile",
      async () => {
        const existing = await this.userRepository.findById(userId);

        if (!existing) {
          throw new NotFoundError("User profile not found", { userId });
        }

        const updated = new UserEntity(
          existing._id,
          existing.authProvider,
          existing.authSubject,
          request.timezone,
          request.language,
          existing.status,
          request.displayName ?? existing.displayName,
          request.email ?? existing.email,
          existing.createdAt,
          new Date(),
        );

        const saved = await this.userRepository.update(updated);
        return this.toProfileResponse(saved);
      },
      { userId },
    );
  }

  private toProfileResponse(user: UserEntity): UserProfileResponse {
    return {
      id: String(user._id),
      displayName: user.displayName,
      email: user.email,
      timezone: user.timezone,
      language: user.language,
      status: user.status,
    };
  }
}
