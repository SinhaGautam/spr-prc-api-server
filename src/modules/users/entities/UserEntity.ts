export type UserStatus = "active" | "inactive" | "suspended";

export class UserEntity {
  constructor(
    public readonly id: string,
    public displayName: string | undefined,
    public email: string | undefined,
    public timezone: string,
    public language: string,
    public status: UserStatus,
  ) {}
}
