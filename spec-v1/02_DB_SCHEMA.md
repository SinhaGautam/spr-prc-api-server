# MongoDB Schema Specification --- V1

## General rules

-   MongoDB is the system of record.
-   Every document has `_id`, `createdAt`, `updatedAt` unless explicitly
    excluded.
-   Dates stored as BSON Date/UTC.
-   User-local day boundaries are resolved using the user's IANA
    timezone.
-   References use stable MongoDB ObjectId values unless an explicit
    public ID is required.
-   Never store large audio binaries in MongoDB.

## Collections

### `users`

``` text
{
  _id,
  authProvider,
  authSubject,
  displayName?,
  email?,
  timezone,
  language,
  status,
  createdAt,
  updatedAt
}
```

Indexes: - unique `(authProvider, authSubject)` - unique `email` only if
email login is supported - `(status, createdAt)`

### `user_preferences`

``` text
{
  _id,
  userId,
  traditionId,
  primaryFocusId?,
  enabledPractices: ["naam_jap", "meditation"],
  readingTarget: { type: "daily_item" },
  naamJapTarget: { repetitions: 108 },
  meditationTarget: { minutes: 5 },
  reminder: {
    enabled: false,
    localTime: "07:00"
  },
  language,
  createdAt,
  updatedAt
}
```

Unique index: - `(userId)`

Rule: - one active preference document per user.

### `traditions`

``` text
{
  _id,
  key,
  name,
  status,
  sortOrder,
  createdAt,
  updatedAt
}
```

V1 seed examples: - hindu - jain

Do not encode every deity as a tradition.

### `focuses`

``` text
{
  _id,
  key,
  name,
  traditionIds: [ObjectId],
  aliases?,
  status,
  sortOrder,
  createdAt,
  updatedAt
}
```

A focus can be associated with one or more traditions where appropriate.

### `tags`

``` text
{
  _id,
  key,
  name,
  type,
  status,
  createdAt,
  updatedAt
}
```

Tag types may include: - theme - time - intent - festival

### `readings`

``` text
{
  _id,
  title,
  subtitle?,
  contentType,
  traditionIds: [ObjectId],
  focusIds: [ObjectId],
  tagIds: [ObjectId],
  language,
  body,
  estimatedMinutes,
  source: {
    kind,
    title?,
    author?,
    publication?,
    reference?,
    rightsNote?
  },
  status,
  version,
  publishedAt?,
  createdAt,
  updatedAt
}
```

V1 content types: - scripture_excerpt - prayer - reflection - story -
teaching

Required: - `source` for canonical/attributed material -
rights/provenance decision before publication

Indexes: - `(status, language, publishedAt)` -
`(status, traditionIds, publishedAt)` -
`(status, focusIds, publishedAt)` - `(status, tagIds, publishedAt)`

### `reading_progress`

``` text
{
  _id,
  userId,
  readingId,
  progressPercent,
  completed,
  firstOpenedAt,
  lastOpenedAt,
  completedAt?,
  updatedAt
}
```

Unique: - `(userId, readingId)`

Indexes: - `(userId, lastOpenedAt)` - `(userId, completed, updatedAt)`

### `mantras`

``` text
{
  _id,
  name,
  text,
  transliteration?,
  pronunciationNote?,
  meaning?,
  traditionIds,
  focusIds,
  language,
  audioAssetId?,
  status,
  createdAt,
  updatedAt
}
```

V1 should contain a curated, small library.

### `naam_jap_sessions`

``` text
{
  _id,
  userId,
  mantraId?,
  mantraTextSnapshot?,
  targetRepetitions,
  completedRepetitions,
  startedAt,
  endedAt?,
  durationSeconds,
  completed,
  clientSessionId,
  createdAt
}
```

Unique: - `(userId, clientSessionId)`

Indexes: - `(userId, startedAt desc)` - `(userId, endedAt desc)`

Important: - store `mantraTextSnapshot` so historical sessions remain
understandable if content changes.

### `meditation_presets`

``` text
{
  _id,
  key,
  durationMinutes,
  startBellAssetId?,
  endBellAssetId?,
  ambientAssetId?,
  status,
  sortOrder,
  createdAt,
  updatedAt
}
```

V1 can also seed these from application configuration if the product
team decides they are not admin-managed.

### `meditation_sessions`

``` text
{
  _id,
  userId,
  presetId?,
  plannedMinutes,
  actualSeconds,
  startedAt,
  endedAt?,
  completed,
  completionReason,
  clientSessionId,
  createdAt
}
```

Unique: - `(userId, clientSessionId)`

Indexes: - `(userId, startedAt desc)`

### `daily_goals`

``` text
{
  _id,
  userId,
  localDate,
  timezone,
  naamJap: {
    enabled,
    targetRepetitions
  },
  meditation: {
    enabled,
    targetMinutes
  },
  createdAt,
  updatedAt
}
```

Unique: - `(userId, localDate)`

Rule: - this is a daily snapshot, not merely a pointer to current
preferences.

### `daily_progress`

``` text
{
  _id,
  userId,
  localDate,
  timezone,

  naamJap: {
    completed,
    repetitions
  },

  meditation: {
    completed,
    minutes
  },

  completedPractices,
  enabledPracticeCount,
  completedPracticeCount,
  dayCompleted,

  createdAt,
  updatedAt
}
```

Unique: - `(userId, localDate)`

Indexes: - `(userId, localDate desc)` -
`(userId, dayCompleted, localDate desc)`

### `songs`

``` text
{
  _id,
  title,
  artist?,
  album?,
  traditionIds,
  focusIds,
  tagIds,
  language,
  audioAssetId,
  artworkAssetId?,
  durationSeconds,
  status,
  publishedAt?,
  createdAt,
  updatedAt
}
```

Indexes: - `(status, publishedAt desc)` -
`(status, language, publishedAt desc)` -
`(status, focusIds, publishedAt desc)` -
`(status, tagIds, publishedAt desc)`

### `media_assets`

``` text
{
  _id,
  type,
  storageKey,
  cdnUrl,
  mimeType,
  sizeBytes,
  durationSeconds?,
  checksum?,
  status,
  createdAt,
  updatedAt
}
```

The API returns CDN metadata/URLs. Backend never proxies streaming
traffic.

### `favorites`

``` text
{
  _id,
  userId,
  entityType,
  entityId,
  createdAt
}
```

Unique: - `(userId, entityType, entityId)`

V1 entity types: - reading - mantra - song

### `playback_history`

``` text
{
  _id,
  userId,
  songId,
  eventType,
  positionSeconds,
  playedAt,
  clientEventId
}
```

Unique: - `(userId, clientEventId)`

Keep history intentionally limited. Do not record heartbeat events every
few seconds.

### `device_registrations`

``` text
{
  _id,
  userId,
  platform,
  pushToken,
  timezone,
  enabled,
  lastSeenAt,
  createdAt,
  updatedAt
}
```

Unique: - `(platform, pushToken)`

## Referential rules

-   deleting a user must remove/anonymize user-owned data according to
    the account-deletion policy
-   deleting content does not physically remove historical activity
    snapshots
-   archived content is not returned by public discovery
-   historical session snapshots remain readable
-   songs never write `daily_progress`
