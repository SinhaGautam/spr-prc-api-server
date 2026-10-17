export interface UserProfileResponse {
  id: string;
  username?: string;
  displayName?: string;
  email?: string;
  timezone: string;
  language: string;
  status: "active" | "inactive" | "suspended";
}
