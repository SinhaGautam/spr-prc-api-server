import type { DeviceRegistrationEntity } from "../entities/DeviceRegistrationEntity";

export interface NotificationRepository {
  saveDevice(device: DeviceRegistrationEntity): Promise<DeviceRegistrationEntity>;
  deleteDevice(userId: string, deviceId: string): Promise<boolean>;
}
