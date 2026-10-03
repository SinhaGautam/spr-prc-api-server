import type { ObjectId } from "../../../shared/domain/types";
import type { Repository, UpdateRepository } from "../../../core/persistence/Repository";
import type { UserEntity } from "../entities/UserEntity";

export interface UserRepository
  extends Repository<UserEntity, ObjectId>,
    UpdateRepository<UserEntity> {
  findById(id: ObjectId): Promise<UserEntity | null>;
  findByAuth(authProvider: string, authSubject: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
}
