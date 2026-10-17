/**
 * OpenAPI 3.1 contract for the V1 API.
 *
 * Keep request schemas/examples aligned with the Zod request schemas in src/modules.
 * Public endpoints explicitly opt out of the global Bearer requirement.
 */
const json = (schema: Record<string, unknown>, example?: unknown) => ({
  content: { "application/json": { schema, ...(example === undefined ? {} : { example }) } },
});
const response = (description: string, schema?: Record<string, unknown>, example?: unknown) => ({
  description,
  ...(schema ? json(schema, example) : {}),
});
const object = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: "object", properties, ...(required.length ? { required } : {}),
});
const string = (description?: string, format?: string) => ({
  type: "string", ...(description ? { description } : {}), ...(format ? { format } : {}),
});
const number = (description?: string, minimum?: number, maximum?: number) => ({
  type: "integer", ...(description ? { description } : {}),
  ...(minimum === undefined ? {} : { minimum }), ...(maximum === undefined ? {} : { maximum }),
});
const bool = { type: "boolean" };

const errorSchema = object({
  error: object({
    code: string(), message: string(), requestId: string(),
  }, ["code", "message", "requestId"]),
}, ["error"]);
const errorExample = { error: { code: "VALIDATION_ERROR", message: "Request validation failed.", requestId: "req_example123" } };
const standardErrors = {
  "400": response("Invalid request payload or query parameters.", errorSchema, errorExample),
  "401": response("Bearer token is missing, invalid, or expired.", errorSchema, { error: { code: "UNAUTHENTICATED", message: "Authentication required.", requestId: "req_example123" } }),
  "429": response("Rate limit exceeded.", errorSchema, { error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests.", requestId: "req_example123" } }),
  "500": response("Unexpected server error.", errorSchema, { error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred.", requestId: "req_example123" } }),
};
const bearerSecurity = [{ Bearer: [] }];
const auth = { security: bearerSecurity };
const publicOperation = { security: [] };
const idempotencyNote = "clientSessionId is a client-generated unique identifier used to safely retry session creation.";

export const v1OpenApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Bhakti App API",
    version: "1.0.0",
    description: "Version 1 API for Naam Jap and Meditation. Create or resume an anonymous installation session with POST /auth/session using a client-generated installation UUID and secret. Store installation credentials in platform secure storage; use the returned opaque Bearer token for protected requests.",
    contact: { name: "Bhakti API" },
  },
  servers: [{ url: "/api/v1", description: "Current application server" }],
  tags: [
    { name: "Authentication", description: "Create and revoke user sessions." },
    { name: "Onboarding", description: "Public onboarding catalog." },
    { name: "Home", description: "Authenticated daily overview." },
    { name: "Profile", description: "User profile and preferences." },
    { name: "Naam Jap", description: "Naam Jap counting practice sessions." },
    { name: "Meditation", description: "Meditation presets and practice sessions." },
    { name: "Goals & Progress", description: "Daily goals, progress history and streaks." },
    { name: "Reminders & Devices", description: "Reminder preferences and push notification devices." },
    { name: "Health", description: "Service health probes." },
  ],
  components: {
    securitySchemes: {
      Bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "opaque token",
        description: "Paste the session token only; Swagger UI adds the 'Bearer ' prefix automatically. Obtain a token from POST /auth/session.",
      },
    },
    schemas: {
      ApiError: errorSchema,
      CreateSessionRequest: object({
        installationId: string("Random UUID generated and persisted by the app.", "uuid"),
        installationSecret: { type: "string", minLength: 43, maxLength: 256, description: "At least 32 random bytes encoded as base64url. Store only in platform secure storage." },
        platform: { type: "string", enum: ["android", "ios"], example: "android" },
        appVersion: string(),
        osVersion: string(),
        deviceModel: string(),
        language: string(),
        timezone: string(),
        displayName: { type: "string", minLength: 1, maxLength: 100, description: "Optional; not collected by the V1 UI." },
      }, ["installationId", "installationSecret", "platform"]),
      AuthSession: object({
        token: string("Bearer token for authenticated requests."),
        expiresAt: string("Token expiration timestamp.", "date-time"),
      }, ["token", "expiresAt"]),
      User: object({
        id: string(), username: string(), displayName: string(), provider: string(),
        status: { type: "string", enum: ["active", "inactive", "suspended"] },
        timezone: string(), language: string(),
      }, ["id", "username", "provider", "status", "timezone", "language"]),
      Installation: object({
        installationId: string(undefined, "uuid"),
        platform: { type: "string", enum: ["android", "ios"] },
        createdAt: string(undefined, "date-time"),
      }, ["installationId", "platform", "createdAt"]),
      AuthResponse: object({
        session: { $ref: "#/components/schemas/AuthSession" },
        user: { $ref: "#/components/schemas/User" },
        installation: { $ref: "#/components/schemas/Installation" },
      }, ["session", "user", "installation"]),
      UpdateProfileRequest: object({
        displayName: { type: "string", minLength: 1, maxLength: 100, example: "Demo User" },
        email: { type: "string", format: "email", example: "demo@example.com" },
        timezone: { type: "string", minLength: 1, maxLength: 100, example: "Asia/Kolkata" },
        language: { type: "string", minLength: 2, maxLength: 10, example: "en" },
      }, ["timezone", "language"]),
      UserProfile: object({
        id: string(), username: string(), displayName: string(), email: string(), timezone: string(), language: string(),
        status: { type: "string", enum: ["active", "inactive", "suspended"] },
      }, ["id", "timezone", "language", "status"]),
      Reminder: object({ enabled: bool, localTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", example: "07:00" } }, ["enabled"]),
      PreferencesRequest: object({
        traditionId: { type: "string", minLength: 1, maxLength: 100, example: "sanatan" },
        primaryFocusId: { type: "string", minLength: 1, maxLength: 100, example: "peace" },
        enabledPractices: { type: "array", minItems: 1, maxItems: 2, items: { type: "string", enum: ["naam_jap", "meditation"] }, example: ["naam_jap", "meditation"] },
        naamJapTarget: { type: "integer", minimum: 1, maximum: 100000, example: 108 },
        meditationTargetMinutes: { type: "integer", minimum: 1, maximum: 180, example: 10 },
        reminder: { $ref: "#/components/schemas/Reminder" },
      }, ["traditionId", "enabledPractices"]),
      Preferences: object({
        userId: string(), traditionId: string(), primaryFocusId: string(),
        enabledPractices: { type: "array", items: { type: "string", enum: ["naam_jap", "meditation"] } },
        naamJapTarget: number(), meditationTargetMinutes: number(),
        reminder: object({ enabled: bool, localTime: string() }, ["enabled", "localTime"]),
      }, ["userId", "traditionId", "enabledPractices", "reminder"]),
      NaamJapSessionRequest: object({
        targetRepetitions: { type: "integer", minimum: 1, maximum: 100000, example: 108 },
        completedRepetitions: { type: "integer", minimum: 0, maximum: 100000, example: 108 },
        startedAt: { type: "string", format: "date-time", example: "2026-10-17T06:00:00.000Z" },
        endedAt: { type: "string", format: "date-time", example: "2026-10-17T06:10:00.000Z" },
        durationSeconds: { type: "integer", minimum: 0, maximum: 86400, example: 600 },
        completed: { type: "boolean", example: true },
        clientSessionId: { type: "string", minLength: 1, maxLength: 255, example: "naam-jap-client-001" },
      }, ["targetRepetitions", "completedRepetitions", "startedAt", "durationSeconds", "completed", "clientSessionId"]),
      NaamJapSession: object({
        id: string(), userId: string(), targetRepetitions: number(), completedRepetitions: number(),
        startedAt: string(undefined, "date-time"), durationSeconds: number(), completed: bool,
        clientSessionId: string(), createdAt: string(undefined, "date-time"), mantraId: string("Legacy historical snapshot only; not accepted on new sessions."), mantraTextSnapshot: string("Legacy historical snapshot only; not accepted on new sessions."),
        endedAt: string(undefined, "date-time"), idempotent: bool,
      }, ["id", "userId", "targetRepetitions", "completedRepetitions", "startedAt", "durationSeconds", "completed", "clientSessionId", "createdAt"]),
      MeditationSessionRequest: object({
        presetId: { type: "string", minLength: 1, example: "meditation-10-min" },
        plannedMinutes: { type: "integer", minimum: 1, maximum: 180, example: 10 },
        actualSeconds: { type: "integer", minimum: 0, maximum: 10800, example: 600 },
        startedAt: { type: "string", format: "date-time", example: "2026-10-17T06:15:00.000Z" },
        endedAt: { type: "string", format: "date-time", example: "2026-10-17T06:25:00.000Z" },
        completed: { type: "boolean", example: true },
        completionReason: { type: "string", enum: ["completed", "interrupted", "cancelled"], example: "completed" },
        clientSessionId: { type: "string", minLength: 1, maxLength: 255, example: "meditation-client-001" },
      }, ["plannedMinutes", "actualSeconds", "startedAt", "completed", "clientSessionId"]),
      MeditationSession: object({
        id: string(), userId: string(), plannedMinutes: number(), actualSeconds: number(),
        startedAt: string(undefined, "date-time"), endedAt: string(undefined, "date-time"), completed: bool,
        completionReason: { type: "string", enum: ["completed", "interrupted", "cancelled"] },
        clientSessionId: string(), idempotent: bool,
      }, ["id", "userId", "plannedMinutes", "actualSeconds", "startedAt", "completed", "clientSessionId"]),
      UpdateReminderRequest: object({ enabled: bool, localTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", example: "07:00" } }, ["enabled"]),
      RegisterDeviceRequest: object({
        deviceId: { type: "string", minLength: 1, maxLength: 255, example: "device-abc-123" },
        token: { type: "string", minLength: 1, maxLength: 4096, example: "push-token-from-provider" },
        platform: { type: "string", enum: ["ios", "android"], example: "android" },
      }, ["deviceId", "token", "platform"]),
      Device: object({ deviceId: string(), platform: { type: "string", enum: ["ios", "android"] }, createdAt: string(undefined, "date-time") }, ["deviceId", "platform", "createdAt"]),
      ProgressToday: object({ date: string(), completed: bool, naam_jap: bool, meditation: bool }, ["date", "completed", "naam_jap", "meditation"]),
      ProgressHistory: object({ month: string(), items: { type: "array", items: object({ date: string(), complete: bool }, ["date", "complete"]) } }, ["month", "items"]),
      Streak: object({ current: number(), longest: number() }, ["current", "longest"]),
      Success: object({ status: { type: "string", example: "ok" } }, ["status"]),
    },
    parameters: {
      DeviceId: { name: "deviceId", in: "path", required: true, description: "Device identifier previously registered by this user.", schema: { type: "string", minLength: 1, maxLength: 255 }, example: "device-abc-123" },
      Month: { name: "month", in: "query", required: false, description: "Month to return in YYYY-MM format. Defaults to the service's current month when omitted.", schema: { type: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])$" }, example: "2026-10" },
    },
  },
  security: bearerSecurity,
  paths: {
    "/auth/session": {
      post: {
        tags: ["Authentication"], summary: "Create session", operationId: "createSession",
        description: "Creates or resumes an anonymous user tied to an installation. The client must generate and securely store installationId (UUID) and installationSecret (32+ random bytes encoded as base64url). Do not attach an old Bearer token to this bootstrap request. Repeating the request with the same secret resumes the same user. The returned access token expires in 15 minutes.",
        ...publicOperation,
        requestBody: { required: true, ...json({ $ref: "#/components/schemas/CreateSessionRequest" }, { installationId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", installationSecret: "replace-with-32-plus-random-bytes-base64url", platform: "android", appVersion: "1.0.0", language: "en", timezone: "Asia/Kolkata" }) },
        responses: {
          "201": response("Session created.", { $ref: "#/components/schemas/AuthResponse" }, { session: { token: "opaque-random-token", expiresAt: "2026-10-17T06:15:00.000Z" }, user: { id: "user-123", username: "seeker-7A91B2C4D5E6F7A8", provider: "installation", status: "active", timezone: "Asia/Kolkata", language: "en" }, installation: { installationId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", platform: "android", createdAt: "2026-10-17T06:00:00.000Z" } }),
          ...standardErrors,
        },
      },
      delete: {
        tags: ["Authentication"], summary: "Revoke session", operationId: "revokeSession",
        description: "Revokes the current Bearer session. Requires Authorization header.",
        responses: { "204": response("Session revoked; no response body."), ...standardErrors },
      },
    },
    "/bootstrap": {
      get: {
        tags: ["Onboarding"], summary: "Onboarding catalog", operationId: "getBootstrap",
        description: "Returns onboarding catalog data used to configure a new user's practices.",
        ...publicOperation,
        responses: { "200": response("Catalog returned.", { type: "object", additionalProperties: true }, { traditions: [], focuses: [], practices: ["naam_jap", "meditation"] }), ...standardErrors },
      },
    },
    "/features": {
      get: {
        tags: ["Configuration"],
        summary: "List feature availability",
        operationId: "listFeatures",
        description: "Returns all feature flags stored in MongoDB, including inactive flags. The isActive value controls feature availability.",
        responses: {
          "200": response(
            "Feature availability returned.",
            object({
              features: {
                type: "array",
                items: object({
                  key: { type: "string", example: "spr-naamjaap-enabled" },
                  isActive: { type: "boolean", example: true },
                }, ["key", "isActive"]),
              },
            }, ["features"]),
            { features: [
              { key: "spr-naamjaap-enabled", isActive: true },
              { key: "spr-meditation-enabled", isActive: true },
            ] },
          ),
          ...standardErrors,
        },
      },
    },
    "/home/today": {
      get: { tags: ["Home"], summary: "Today view", operationId: "getTodayView", responses: { "200": response("Today's home view.", { type: "object", additionalProperties: true }, { date: "2026-10-17", goals: {}, progress: {} }), ...standardErrors } },
    },
    "/me": {
      get: { tags: ["Profile"], summary: "Get user profile", operationId: "getProfile", responses: { "200": response("Current user's profile.", { $ref: "#/components/schemas/UserProfile" }, { id: "user-123", displayName: "Demo User", email: "demo@example.com", timezone: "Asia/Kolkata", language: "en", status: "active" }), ...standardErrors } },
      put: {
        tags: ["Profile"], summary: "Update user profile", operationId: "updateProfile",
        requestBody: { required: true, ...json({ $ref: "#/components/schemas/UpdateProfileRequest" }, { displayName: "Demo User", email: "demo@example.com", timezone: "Asia/Kolkata", language: "en" }) },
        responses: { "200": response("Profile updated.", { $ref: "#/components/schemas/UserProfile" }, { id: "user-123", displayName: "Demo User", email: "demo@example.com", timezone: "Asia/Kolkata", language: "en", status: "active" }), ...standardErrors },
      },
    },
    "/me/preferences": {
      get: { tags: ["Profile"], summary: "Get preferences", operationId: "getPreferences", responses: { "200": response("Current preferences.", { $ref: "#/components/schemas/Preferences" }, { userId: "user-123", traditionId: "sanatan", primaryFocusId: "peace", enabledPractices: ["naam_jap", "meditation"], naamJapTarget: 108, meditationTargetMinutes: 10, reminder: { enabled: true, localTime: "07:00" } }), ...standardErrors } },
      put: {
        tags: ["Profile"], summary: "Update preferences", operationId: "updatePreferences",
        requestBody: { required: true, ...json({ $ref: "#/components/schemas/PreferencesRequest" }, { traditionId: "sanatan", primaryFocusId: "peace", enabledPractices: ["naam_jap", "meditation"], naamJapTarget: 108, meditationTargetMinutes: 10, reminder: { enabled: true, localTime: "07:00" } }) },
        responses: { "200": response("Preferences updated.", { $ref: "#/components/schemas/Preferences" }, { userId: "user-123", traditionId: "sanatan", primaryFocusId: "peace", enabledPractices: ["naam_jap", "meditation"], naamJapTarget: 108, meditationTargetMinutes: 10, reminder: { enabled: true, localTime: "07:00" } }), ...standardErrors },
      },
    },
    "/naam-jap/sessions": {
      post: {
        tags: ["Naam Jap"], summary: "Create Naam Jap session", operationId: "createNaamJapSession",
        description: idempotencyNote,
        requestBody: { required: true, ...json({ $ref: "#/components/schemas/NaamJapSessionRequest" }, { targetRepetitions: 108, completedRepetitions: 108, startedAt: "2026-10-17T06:00:00.000Z", endedAt: "2026-10-17T06:10:00.000Z", durationSeconds: 600, completed: true, clientSessionId: "naam-jap-client-001" }) },
        responses: { "201": response("Session recorded.", { $ref: "#/components/schemas/NaamJapSession" }, { id: "session-123", userId: "user-123", targetRepetitions: 108, completedRepetitions: 108, startedAt: "2026-10-17T06:00:00.000Z", endedAt: "2026-10-17T06:10:00.000Z", durationSeconds: 600, completed: true, clientSessionId: "naam-jap-client-001", createdAt: "2026-10-17T06:10:01.000Z" }), "200": response("Existing session returned for an idempotent retry.", { $ref: "#/components/schemas/NaamJapSession" }), ...standardErrors },
      },
      get: { tags: ["Naam Jap"], summary: "List Naam Jap sessions", operationId: "listNaamJapSessions", responses: { "200": response("Sessions for the authenticated user.", { type: "array", items: { $ref: "#/components/schemas/NaamJapSession" } }, []), ...standardErrors } },
    },
    "/meditation/presets": {
      get: { tags: ["Meditation"], summary: "List meditation presets", operationId: "listMeditationPresets", ...publicOperation,
        responses: { "200": response("Available meditation presets.", object({ items: { type: "array", items: object({ id: string(), key: string(), durationMinutes: number() }, ["id", "key", "durationMinutes"]) } }, ["items"]), { items: [{ id: "preset-10", key: "calm", durationMinutes: 10 }] }), ...standardErrors },
      },
    },
    "/meditation/sessions": {
      post: {
        tags: ["Meditation"], summary: "Create meditation session", operationId: "createMeditationSession",
        description: idempotencyNote,
        requestBody: { required: true, ...json({ $ref: "#/components/schemas/MeditationSessionRequest" }, { presetId: "preset-10", plannedMinutes: 10, actualSeconds: 600, startedAt: "2026-10-17T06:15:00.000Z", endedAt: "2026-10-17T06:25:00.000Z", completed: true, completionReason: "completed", clientSessionId: "meditation-client-001" }) },
        responses: { "201": response("Session recorded.", { $ref: "#/components/schemas/MeditationSession" }, { id: "meditation-session-123", userId: "user-123", plannedMinutes: 10, actualSeconds: 600, startedAt: "2026-10-17T06:15:00.000Z", endedAt: "2026-10-17T06:25:00.000Z", completed: true, completionReason: "completed", clientSessionId: "meditation-client-001" }), "200": response("Existing session returned for an idempotent retry.", { $ref: "#/components/schemas/MeditationSession" }), ...standardErrors },
      },
      get: { tags: ["Meditation"], summary: "List meditation sessions", operationId: "listMeditationSessions", responses: { "200": response("Sessions for the authenticated user.", { type: "array", items: { $ref: "#/components/schemas/MeditationSession" } }, []), ...standardErrors } },
    },
    "/goals/today": {
      get: { tags: ["Goals & Progress"], summary: "Get today's goals", operationId: "getTodayGoals", responses: { "200": response("Daily goals.", { type: "object", additionalProperties: true }, { date: "2026-10-17", naamJapTarget: 108, meditationTargetMinutes: 10 }), ...standardErrors } },
    },
    "/progress/today": {
      get: { tags: ["Goals & Progress"], summary: "Get today's progress", operationId: "getTodayProgress", responses: { "200": response("Today's practice progress.", { $ref: "#/components/schemas/ProgressToday" }, { date: "2026-10-17", completed: true, naam_jap: true, meditation: true }), ...standardErrors } },
    },
    "/progress/history": {
      get: {
        tags: ["Goals & Progress"], summary: "Get progress history", operationId: "getProgressHistory",
        parameters: [{ $ref: "#/components/parameters/Month" }],
        responses: { "200": response("Progress history for the selected month.", { $ref: "#/components/schemas/ProgressHistory" }, { month: "2026-10", items: [{ date: "2026-10-17", complete: true }] }), ...standardErrors },
      },
    },
    "/progress/streak": {
      get: { tags: ["Goals & Progress"], summary: "Get progress streak", operationId: "getProgressStreak", responses: { "200": response("Current and longest practice streak.", { $ref: "#/components/schemas/Streak" }, { current: 4, longest: 12 }), ...standardErrors } },
    },
    "/me/reminder": {
      put: {
        tags: ["Reminders & Devices"], summary: "Update reminder", operationId: "updateReminder",
        requestBody: { required: true, ...json({ $ref: "#/components/schemas/UpdateReminderRequest" }, { enabled: true, localTime: "07:00" }) },
        responses: { "200": response("Reminder updated.", object({ userId: string(), reminder: { $ref: "#/components/schemas/Reminder" }, timezone: string() }, ["userId", "reminder", "timezone"]), { userId: "user-123", reminder: { enabled: true, localTime: "07:00" }, timezone: "Asia/Kolkata" }), ...standardErrors },
      },
    },
    "/devices": {
      post: {
        tags: ["Reminders & Devices"], summary: "Register device", operationId: "registerDevice",
        requestBody: { required: true, ...json({ $ref: "#/components/schemas/RegisterDeviceRequest" }, { deviceId: "device-abc-123", token: "push-token-from-provider", platform: "android" }) },
        responses: { "201": response("Device registered.", { $ref: "#/components/schemas/Device" }, { deviceId: "device-abc-123", platform: "android", createdAt: "2026-10-17T06:00:00.000Z" }), ...standardErrors },
      },
    },
    "/devices/{deviceId}": {
      delete: {
        tags: ["Reminders & Devices"], summary: "Remove device", operationId: "deleteDevice",
        parameters: [{ $ref: "#/components/parameters/DeviceId" }],
        responses: { "204": response("Device removed; no response body."), ...standardErrors },
      },
    },
    "/health/live": {
      get: { tags: ["Health"], summary: "Liveness check", operationId: "healthLive", ...publicOperation,
        responses: { "200": response("Process is alive.", { $ref: "#/components/schemas/Success" }, { status: "ok" }) },
      },
    },
    "/health/ready": {
      get: { tags: ["Health"], summary: "Readiness check", operationId: "healthReady", ...publicOperation,
        responses: { "200": response("Service is ready.", { $ref: "#/components/schemas/Success" }, { status: "ok" }), "503": response("Service is not ready.", errorSchema, errorExample) },
      },
    },
  },
};
