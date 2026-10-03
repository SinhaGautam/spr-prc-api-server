export interface ReminderResponse { userId: string; reminder: { enabled: boolean; localTime: string }; timezone: string; }
export interface DeviceResponse { deviceId: string; platform: "ios" | "android"; createdAt: string; }
