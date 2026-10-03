# Offline & Synchronization Specification --- V1

## Goal

A spiritual practice should not stop because the network is temporarily
unavailable.

## Local data

The mobile app should locally persist: - onboarding/preferences - cached
published reading content - selected mantra - active Naam Jap
counter/session - active meditation timer state - unsynced completed
activity sessions - limited recent song metadata

The backend remains authoritative after synchronization.

## Syncable activity records

At minimum: - Naam Jap sessions - Meditation sessions - Reading
completion/progress

Every syncable write has a client-generated idempotency key.

## Sync protocol

``` text
Mobile
  ↓
Local write
  ↓
Sync queue
  ↓
POST API
  ↓
Server idempotency check
  ↓
Persist once
  ↓
Return canonical result
  ↓
Remove queue item
```

On network failure: - retain queue item - retry later

On server timeout: - retry with same idempotency key

Never generate a new idempotency key for a retry of the same logical
activity.

## Conflict policy

### Reading progress

Server uses a deterministic rule: - completed wins over incomplete -
otherwise latest valid progress update wins according to
timestamp/version policy

### Naam Jap

Sessions are append-like. - duplicate key = same session - separate keys
= separate sessions

### Meditation

Same as Naam Jap.

### Preferences

V1 can use last-write-wins with server timestamp/version if multi-device
support exists.

## Daily progress

Daily progress is derived from accepted activities.

The client may show optimistic progress, but after synchronization the
server response is canonical.

## No offline requirement

The following do not need offline backend access: - content search
against uncached catalogue - fetching new songs - publishing/admin
operations
