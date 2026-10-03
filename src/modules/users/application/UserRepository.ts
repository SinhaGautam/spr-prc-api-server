import type { Repository, UpdateRepository } from "../../../core/persistence/Repository";
import type { UserEntity } from "../entities/UserEntity";

export interface UserRepository
  extends Repository<UserEntity, string>,
    UpdateRepository<UserEntity> {
  findById(id: string): Promise<UserEntity | null>;
}
