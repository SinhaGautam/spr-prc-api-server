# Offline & Synchronization Specification — V2

## Goal
Naam Jap and Meditation continue when connectivity is unavailable.

## Local data
- onboarding/preferences
- selected mantra
- active Naam Jap session
- active meditation timer state
- unsynced Naam Jap sessions
- unsynced Meditation sessions

## Syncable activity records
- Naam Jap sessions
- Meditation sessions

Every syncable write has a client-generated idempotency key.

## Sync protocol
```text
Mobile → Local write → Sync queue → POST API → server idempotency check → persist once → canonical response → remove queue item
```

Same logical activity retry uses the same key.

## Conflict policy
Naam Jap and Meditation are append-like activities. Same key = same session; separate keys = separate sessions. Preferences may use last-write-wins with server timestamp/version for multi-device support.

## Removed offline behavior
No V2 sync queue, cache, or progress model exists for Reading, Songs, playback, or reading progress.