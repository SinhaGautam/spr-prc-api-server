# API Specification --- V1

## API conventions

Base path:

``` text
/api/v1
```

Authentication: - authenticated user is derived from access token -
never trust client-supplied `userId`

Content endpoints are public only if product explicitly decides so; user
activity endpoints require authentication.

## Authentication

### `POST /auth/session`

Create/establish an authenticated session.

### `DELETE /auth/session`

Terminate current session where supported.

## Bootstrap / onboarding

### `GET /bootstrap`

Returns minimum data required to build onboarding: - traditions -
available focuses - available practice types - meditation presets -
supported languages

### `PUT /me/preferences`

Updates onboarding/preferences.

Request concept:

``` text
{
  traditionId,
  primaryFocusId?,
  enabledPractices,
  naamJapTarget?,
  meditationTargetMinutes?,
  reminder?
}
```

Response: - normalized saved preferences - today's goal snapshot if
already initialized

## Home

### `GET /home/today`

Returns a purpose-built Today view model: - greeting/context - featured
reading - current daily goals/progress - default mantra - meditation
preset - optional song discovery entry

The endpoint is a read composition endpoint. It must not expose raw
database documents.

## Reading

### `GET /readings`

Filters: - language - tradition - focus - tag - cursor

Only published content.

### `GET /readings/:readingId`

Returns reading content and provenance.

### `PUT /readings/:readingId/progress`

Updates user reading progress.

### `POST /readings/:readingId/complete`

Marks the reading complete.

Requirements: - idempotent - updates reading progress - emits an
application-level completion result to daily-practice - must not
double-count completion

## Naam Jap

### `GET /mantras`

Returns available curated mantras.

### `POST /naam-jap/sessions`

Creates a completed/partial session.

Request:

``` text
{
  mantraId?,
  mantraText?,
  targetRepetitions,
  completedRepetitions,
  startedAt,
  endedAt?,
  durationSeconds,
  completed,
  clientSessionId
}
```

Rules: - `clientSessionId` required for offline-safe idempotency -
completed repetitions cannot be negative - completed repetitions cannot
exceed the configured maximum without an explicit product rule - user
may use a custom mantra only if V1 enables that feature

### `GET /naam-jap/sessions`

Returns current user's session history.

## Meditation

### `GET /meditation/presets`

### `POST /meditation/sessions`

Creates a session record.

### `GET /meditation/sessions`

Returns current user's history.

A timer itself runs on-device. The backend records the result, not every
timer tick.

## Daily practice

### `GET /goals/today`

Returns today's goal snapshot.

### `GET /progress/today`

Returns today's progress.

### `GET /progress/history`

Returns calendar-oriented history using pagination/month ranges.

### `GET /progress/streak`

Returns: - current streak - longest streak

Streak semantics are defined in `04_DOMAIN_RULES.md`.

## Songs

### `GET /songs`

Filters: - language - tradition - focus - tag - cursor

### `GET /songs/:songId`

Returns: - metadata - CDN audio URL - artwork URL - duration

### `POST /songs/:songId/playback-events`

Optional V1 endpoint for meaningful playback events.

Event types: - started - resumed - completed - stopped

No heartbeat events.

## Favorites

### `GET /favorites`

Filter by entity type.

### `PUT /favorites/:entityType/:entityId`

Idempotently creates favorite.

### `DELETE /favorites/:entityType/:entityId`

Idempotently removes favorite.

## Notifications

### `PUT /me/reminder`

Sets reminder preference.

### `POST /devices`

Registers push device token if push notifications are enabled.

### `DELETE /devices/:deviceId`

Removes device registration.

## Health

### `GET /health/live`

Process is alive.

### `GET /health/ready`

Dependencies required for serving traffic are available.

## Explicitly forbidden V1 API patterns

Do not create: - generic `/crud/*` endpoints - `/users/:id/...` for
current-user activity when token already identifies the user - `/events`
dumping arbitrary analytics events - song-to-goal endpoints - endpoints
for UI-only state - endpoints for timer ticks - endpoints that expose
MongoDB documents directly


## 11. Input/output model requirement

Every endpoint MUST have:
- Request Model
- Request Zod Schema
- Response Model
- Response Zod Schema
- Error Model
- authentication/authorization
- trace/logging requirements
- tests

See `05A_REQUEST_RESPONSE_MODEL_SPEC.md`.

## 12. API trace requirement

Every request must have a requestId and a structured completion trace containing method, route, status, and duration. Business operations emit meaningful application events where specified.

See `05B_ERROR_LOGGING_TRACE_SPEC.md`.
