import type { ObjectId, UserStatus } from "../../../shared/domain/types";

export class UserEntity {
  constructor(
    public readonly _id: ObjectId,
    public authProvider: string,
    public authSubject: string,
    public timezone: string,
    public language: string,
    public status: UserStatus,
    public displayName?: string,
    public email?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
