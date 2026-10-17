# API Specification — Backend V1

## API conventions
Base path: /api/v1.

Authentication derives current user from the authenticated principal. Never trust client-supplied user IDs.

Every public endpoint has request/response models and Zod schemas, auth policy, error contract, trace/logging requirements, and tests.

## Authentication
- POST /auth/session
- DELETE /auth/session

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
