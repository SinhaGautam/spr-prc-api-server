import type { NotificationRepository } from "../application/NotificationRepository";
import type { DeviceRegistrationEntity } from "../entities/DeviceRegistrationEntity";

export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly devices = new Map<string, DeviceRegistrationEntity>();

  async saveDevice(device: DeviceRegistrationEntity): Promise<DeviceRegistrationEntity> {
    this.devices.set(`${device.userId}:${device.id}`, device);
    return device;
  }

  async deleteDevice(userId: string, deviceId: string): Promise<boolean> {
    return this.devices.delete(`${userId}:${deviceId}`);
  }
}
