export class DeviceRegistrationEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly platform: "ios" | "android",
    public readonly createdAt: Date = new Date(),
  ) {}
}
