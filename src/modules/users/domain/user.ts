import { User } from "../../../shared/domain/entities";

export type UserEntity = User;

export const userStatuses = ["active", "inactive", "suspended"] as const;
