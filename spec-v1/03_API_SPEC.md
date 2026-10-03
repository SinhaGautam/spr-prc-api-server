# API Specification — Backend V1

## API conventions
Base path: `/api/v1`

Authentication derives current user from the authenticated principal; never trust client-supplied `userId`.

Every endpoint has Request/Response models, Zod schemas, error contract, auth policy, trace/logging contract, and tests.

## Authentication
- `POST /auth/session`
- `DELETE /auth/session`

## Bootstrap
### `GET /bootstrap`
Returns onboarding data:
- traditions
- available devotional focuses
- practice types: Naam Jap, Meditation
- meditation presets
- supported languages

No Reading/Song practice type.

## Preferences
### `PUT /me/preferences`
Supports tradition, optional focus, enabled V1 practices, targets, reminder.

## Home
### `GET /home/today`
Returns greeting/context, today's goals/progress, default mantra, meditation preset.

Must not expose Reading, Songs, playback, or favorites data.

## Naam Jap
- `GET /mantras`
- `POST /naam-jap/sessions`
- `GET /naam-jap/sessions`

`clientSessionId` provides offline-safe idempotency.

## Meditation
- `GET /meditation/presets`
- `POST /meditation/sessions`
- `GET /meditation/sessions`

Timer ticks remain client-side.

## Progress
- `GET /goals/today`
- `GET /progress/today`
- `GET /progress/history`
- `GET /progress/streak`

## Notifications
- `PUT /me/reminder`
- `POST /devices`
- `DELETE /devices/:deviceId`

## Health
- `GET /health/live`
- `GET /health/ready`

## Removed endpoints
V1 MUST NOT register:
- `GET /readings`
- `GET /readings/:readingId`
- `PUT /readings/:readingId/progress`
- `POST /readings/:readingId/complete`
- `GET /songs`
- `GET /songs/:songId`
- `POST /songs/:songId/playback-events`
- `GET /favorites`
- `PUT /favorites/:entityType/:entityId`
- `DELETE /favorites/:entityType/:entityId`

Do not recreate them through `/events`, generic content routes, or aliases.

## Explicitly forbidden
Generic CRUD, arbitrary user IDs, direct MongoDB responses, timer tick endpoints, hidden legacy aliases.