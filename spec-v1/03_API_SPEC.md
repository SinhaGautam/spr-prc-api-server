# API Specification — Backend V1

## API conventions
Base path: /api/v1.

Authentication derives current user from the authenticated principal. Never trust client-supplied user IDs.

Every public endpoint has request/response models and Zod schemas, auth policy, error contract, trace/logging requirements, and tests.

## Authentication and anonymous installation lifecycle

- POST /auth/session
- DELETE /auth/session

### POST /auth/session — create or resume an anonymous installation session

Public bootstrap endpoint. The mobile client generates and securely stores a random UUID `installationId` and a cryptographically random `installationSecret` (at least 32 random bytes, encoded as base64url). Do not use hardware IDs, push tokens, or client-generated user IDs as credentials.

Request:
```json
{
  "installationId": "UUID",
  "installationSecret": "base64url-secret",
  "platform": "android",
  "appVersion": "1.0.0",
  "osVersion": "Android 16",
  "deviceModel": "optional model family",
  "language": "en",
  "timezone": "Asia/Kolkata"
}
```

- `installationId` and `installationSecret` are required; platform is required.
- Device metadata fields are optional and treated as untrusted client claims.
- `displayName` is optional for backward-compatible contract evolution, but the V1 UI does not ask for or send it. The backend generates a stable, non-authenticating username such as `seeker-7A91B2C4`.
- First request creates an `installations` record and an anonymous `users` record. A repeat request must prove possession of the installation secret and resolves the same user.
- A session bearer token is generated with a cryptographically secure random generator. Only its SHA-256 hash is persisted.
- Access session expires after 15 minutes. The client may call this endpoint again using the installation credentials to establish a new session.
- Never log the installation secret or bearer token.
- On the first successful session bootstrap, the client may call `POST /devices` only after it has a push-provider token. That endpoint is for notification delivery, not authentication.
- Repeated registration for an existing installation must not create another user. Enforce unique indexes on `installations.installationId` and `users(authProvider, authSubject)`; handle duplicate-key races safely.

Response includes `session { token, expiresAt }`, `user { id, username, displayName?, provider, status, timezone, language }`, and safe installation metadata. Never return the installation secret hash or any stored credential hash.

### DELETE /auth/session — revoke current session

Requires a valid Bearer token. Revokes the current server-side session. It does not delete the user or installation. A client that retains the installation secret can create a new session; the UI must not label this action as “delete account”.

### Reset local data button

This is a client-side cache/data reset, not a backend account deletion endpoint. Before clearing local state, attempt to sync pending practice sessions and warn if unsynced data would be lost. Preserve the installation ID and installation secret so the same anonymous user can resume. Do not clear these credentials unless the user explicitly chooses “Start fresh”; starting fresh generates a new installation ID and secret and creates a separate anonymous identity.

## Bootstrap
- GET /bootstrap

Returns traditions, devotional focuses, V1 practices, meditation presets, supported languages, and reminder defaults.

## Feature availability
- GET /features

Returns only the names of features enabled for V1. Feature availability is a server-owned release configuration, not an individual user's practice preference.

Feature flag naming convention:
- Use the exact format `spr-{feature}-enabled`.
- Use lowercase ASCII letters and hyphens; do not use underscores or spaces.
- Use concise, unambiguous feature identifiers without transliteration separators.
- Keep the `spr-` prefix and `-enabled` suffix consistent for every feature flag.
- Keep identifiers stable and use the same canonical values in server configuration, API responses, schemas, tests, and clients.
- Return the full canonical flag name as the feature identifier; do not convert it to a display label.

V1 enabled feature flags:
- `spr-naamjaap-enabled`
- `spr-meditation-enabled`

Response model:
```json
{
  "features": ["spr-naamjaap-enabled", "spr-meditation-enabled"]
}
```

Contract requirements:
- Authentication is required; derive the principal from the authentication middleware.
- No request body, query parameters, or client-provided user ID is accepted.
- Response uses a module-owned response model and Zod response schema.
- Return only enabled feature flag names; do not include disabled feature flags or per-feature boolean values.
- Feature toggles do not create, restore, or expose Reading or Songs endpoints, modules, content, preferences, or data.
- Disabled features must be treated by clients as unavailable. Server routing and authorization remain authoritative; hiding a UI element is not access control.
- Log request ID, route, outcome, and a safe user identifier as available; do not log secrets or user content.
- Tests cover the exact V1 enabled feature names, response validation, authentication failure, and absence of Reading/Songs route exposure.

## User profile
- GET /me
- PUT /me

## Preferences
- GET /me/preferences
- PUT /me/preferences

Supports tradition, optional focus, enabled V1 practices, targets, reminder, and language-related preferences.

## Home
- GET /home/today

Returns greeting/context, today's goals/progress, default mantra, and meditation preset.

Must not expose Reading, Songs, playback, or favorites data.

## Naam Jap
- GET /mantras
- POST /naam-jap/sessions
- GET /naam-jap/sessions

clientSessionId provides offline-safe idempotency. Backend persists sessions, not individual taps.

## Meditation
- GET /meditation/presets
- POST /meditation/sessions
- GET /meditation/sessions

Timer ticks remain client-side. Backend persists session results.

## Daily goals and progress
- GET /goals/today
- GET /progress/today
- GET /progress/history
- GET /progress/streak

Only Naam Jap and Meditation contribute to V1 completion and streak calculations.

## Notifications
- PUT /me/reminder
- POST /devices
- DELETE /devices/:deviceId

## Health
- GET /health/live
- GET /health/ready

## Removed endpoints

V1 MUST NOT register:
- GET /readings
- GET /readings/:readingId
- PUT /readings/:readingId/progress
- PUT /readings/:readingId/complete
- GET /songs
- GET /songs/:songId
- POST /songs/:songId/playback-events
- GET /favorites
- PUT /favorites/:entityType/:entityId
- DELETE /favorites/:entityType/:entityId

Do not recreate them through /events, generic content routes, aliases, or dormant modules.

## Explicitly forbidden

Generic CRUD, arbitrary user IDs, direct MongoDB responses, timer tick endpoints, hidden legacy aliases, and generic public content discovery endpoints not listed above.
