import { BaseApiService } from "../../../core/application/BaseApiService";
import type { PreferencesService } from "../../preferences/application/PreferencesService";
import type { RegisterDeviceRequest, UpdateReminderRequest } from "../contracts/NotificationRequest";
import { DeviceRegistrationEntity } from "../entities/DeviceRegistrationEntity";
import type { NotificationRepository } from "./NotificationRepository";

export class NotificationsService extends BaseApiService {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly preferencesService: PreferencesService,
  ) { super(); }

  async updateReminder(userId: string, request: UpdateReminderRequest) {
    return this.execute("notifications.updateReminder", async () => {
      const current = await this.preferencesService.getPreferences(userId);
      return this.preferencesService.updatePreferences(userId, {
        traditionId: current.traditionId,
        primaryFocusId: current.primaryFocusId,
        enabledPractices: current.enabledPractices,
        naamJapTarget: current.naamJapTarget,
        meditationTargetMinutes: current.meditationTargetMinutes,
        reminder: {
          enabled: request.enabled,
          localTime: request.localTime ?? current.reminder.localTime,
        },
      });
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
