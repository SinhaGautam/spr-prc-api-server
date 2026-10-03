import type { Db } from "mongodb";
import type { NotificationRepository } from "../application/NotificationRepository";
import { DeviceRegistrationEntity } from "../entities/DeviceRegistrationEntity";

export class MongoNotificationRepository implements NotificationRepository {
  constructor(private readonly db: Db) {}

  async saveDevice(device: DeviceRegistrationEntity): Promise<DeviceRegistrationEntity> {
    await this.db.collection("device_registrations").updateOne(
      { userId: device.userId, deviceId: device.id },
      { $set: { userId: device.userId, deviceId: device.id, token: device.token, platform: device.platform, updatedAt: new Date() }, $setOnInsert: { createdAt: device.createdAt } },
      { upsert: true },
    );
    return device;
  }

  async deleteDevice(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.db.collection("device_registrations").deleteOne({ userId, deviceId });
    return result.deletedCount > 0;
  }
}
