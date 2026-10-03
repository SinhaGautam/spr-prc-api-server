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
