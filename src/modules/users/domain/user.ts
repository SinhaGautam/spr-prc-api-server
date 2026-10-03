import type { UserEntity } from "../entities/UserEntity";

export type User = UserEntity;

export const userStatuses = ["active", "inactive", "suspended"] as const;
