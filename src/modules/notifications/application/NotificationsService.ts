import { logger } from "../../../lib/logger";

const reminderStore = new Map<string, { enabled: boolean; localTime?: string; timezone?: string }>();
const deviceStore = new Map<string, Array<{ deviceId: string; token: string; platform: "ios" | "android"; createdAt: string }>>();

export class NotificationsService {
  async updateReminder(userId: string, payload: { enabled: boolean; localTime?: string }) {
    try {
      const normalized = { enabled: payload.enabled, localTime: payload.localTime ?? "07:00", timezone: "Asia/Kolkata" };
      reminderStore.set(userId, normalized);
      logger.info({ userId, reminder: normalized }, "Reminder preference updated");
      return { userId, reminder: normalized };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to update reminder");
      throw error;
    }
  }

  async registerDevice(userId: string, payload: { token: string; platform: "ios" | "android" }) {
    try {
      const deviceId = `device-${Date.now()}`;
      const items = deviceStore.get(userId) ?? [];
      items.push({ deviceId, ...payload, createdAt: new Date().toISOString() });
      deviceStore.set(userId, items);
      logger.info({ userId, deviceId }, "Device registered");
      return { deviceId, ...payload, createdAt: new Date().toISOString() };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to register device");
      throw error;
    }
  }

  async deleteDevice(userId: string, deviceId: string) {
    try {
      const items = deviceStore.get(userId) ?? [];
      const filtered = items.filter((device) => device.deviceId !== deviceId);
      deviceStore.set(userId, filtered);
      logger.info({ userId, deviceId }, "Device removed");
      return { deleted: true, deviceId };
    } catch (error) {
      logger.error({ err: error, userId, deviceId }, "Failed to remove device");
      throw error;
    }
  }
}
