import { BaseApiService } from "../../../core/application/BaseApiService";
import type { RegisterDeviceRequest, UpdateReminderRequest } from "../contracts/NotificationRequest";
import { DeviceRegistrationEntity } from "../entities/DeviceRegistrationEntity";
import type { NotificationRepository } from "./NotificationRepository";

export class NotificationsService extends BaseApiService {
  private readonly reminders = new Map<string, { enabled: boolean; localTime: string }>();

  constructor(private readonly repository: NotificationRepository) { super(); }

  async updateReminder(userId: string, request: UpdateReminderRequest) {
    return this.execute("notifications.updateReminder", async () => {
      const reminder = { enabled: request.enabled, localTime: request.localTime ?? "07:00" };
      this.reminders.set(userId, reminder);
      return { userId, reminder, timezone: "Asia/Kolkata" };
    }, { userId });
  }

  async registerDevice(userId: string, request: RegisterDeviceRequest) {
    return this.execute("notifications.registerDevice", async () => {
      const device = await this.repository.saveDevice(new DeviceRegistrationEntity(
        request.deviceId, userId, request.token, request.platform,
      ));
      return { deviceId: device.id, platform: device.platform, createdAt: device.createdAt.toISOString() };
    }, { userId, deviceId: request.deviceId, platform: request.platform });
  }

  async deleteDevice(userId: string, deviceId: string): Promise<void> {
    await this.execute("notifications.deleteDevice", async () => {
      await this.repository.deleteDevice(userId, deviceId);
    }, { userId, deviceId });
  }
}
