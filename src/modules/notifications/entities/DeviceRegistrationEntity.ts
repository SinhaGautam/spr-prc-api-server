import type { ObjectId } from "../../../shared/domain/types";

export class DeviceRegistrationEntity {
  constructor(
    public readonly _id: ObjectId,
    public userId: ObjectId,
    public token: string,
    public platform: "ios" | "android",
    public readonly createdAt: Date = new Date(),
  ) {}
}
