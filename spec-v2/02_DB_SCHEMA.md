# MongoDB Schema Specification — Backend V2

## General rules
- MongoDB is system of record.
- Dates are BSON Date/UTC.
- User-local daily boundaries use IANA timezone.
- API models are never MongoDB documents.
- Large media binaries are never stored in MongoDB.

## Active V2 collections

### `users`
Retained from V1 with existing identity/profile fields and indexes.

### `user_preferences`
```text
{
  _id,
  userId,
  traditionId,
  primaryFocusId?,
  enabledPractices: ["naam_jap", "meditation"],
  naamJapTarget: { repetitions: 108 },
  meditationTarget: { minutes: 5 },
  reminder: { enabled: false, localTime: "07:00" },
  language,
  createdAt,
  updatedAt
}
```
Unique: `(userId)`.

V2 MUST reject any Reading/Song practice value.

### `traditions`
Retained from V1.

### `focuses`
Retained from V1.

### `tags`
Retained only where needed for V2-supported content.

### `mantras`
Retain V1 curated mantra model.

### `naam_jap_sessions`
Retain V1 session model. Unique: `(userId, clientSessionId)`. Indexes: `(userId, startedAt desc)`, `(userId, endedAt desc)`.

### `meditation_presets`
Retain V1 preset model.

### `meditation_sessions`
Retain V1 session model. Unique: `(userId, clientSessionId)`. Index: `(userId, startedAt desc)`.

### `daily_goals`
V2 removes the Reading branch:
```text
{
  _id, userId, localDate, timezone,
  naamJap: { enabled, targetRepetitions },
  meditation: { enabled, targetMinutes },
  createdAt, updatedAt
}
```
Unique: `(userId, localDate)`.

### `daily_progress`
V2 removes the Reading branch:
```text
{
  _id, userId, localDate, timezone,
  naamJap: { completed, repetitions },
  meditation: { completed, minutes },
  completedPractices,
  enabledPracticeCount,
  completedPracticeCount,
  dayCompleted,
  createdAt, updatedAt
}
```
Unique: `(userId, localDate)`.
Indexes: `(userId, localDate desc)`, `(userId, dayCompleted, localDate desc)`.

### `media_assets`
Retain only for approved mantra/meditation media. No song media.

### `device_registrations`
Retain from V1.

## Collections removed from active V2
- `readings`
- `reading_progress`
- `songs`
- `playback_history`
- `favorites`

Remove their repositories, indexes, API schemas, application references, and seed records.

## Legacy migration policy
Do not reinterpret legacy Reading/Song records as V2 activities.

Before production deployment, choose and document one:
1. archive legacy collections outside the V2 application path, or
2. retain temporarily but make them unreachable from all V2 repositories/API and schedule deletion under an approved retention policy.

The chosen policy must be verified by migration/retention tests.

## Referential rules
- user deletion covers all active V2 user-owned data
- archived V2 content is not public
- historical Naam Jap snapshots retain sufficient immutable data
- legacy Reading/Song data is not exposed by V2 APIs