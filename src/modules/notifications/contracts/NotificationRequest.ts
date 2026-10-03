export interface UpdateReminderRequest { enabled: boolean; localTime?: string; }
export interface RegisterDeviceRequest { token: string; platform: "ios" | "android"; }
