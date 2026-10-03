export interface UserProfileResponse {
  id: string;
  displayName?: string;
  email?: string;
  timezone: string;
  language: string;
  status: "active" | "inactive" | "suspended";
}
