# Spec-Driven Implementation Plan — Backend V2

## Phase 0 — Specification baseline
Preserve `spec-v1/` unchanged. Create `spec-v2/`. Inventory all V1 Reading/Song references.

## Phase 1 — Foundation
Verify strict TypeScript, Zod, centralized middleware, request IDs, structured logging/Pino, centralized errors, CORS/security/body limits, rate limits, health/readiness, MongoDB lifecycle, graceful shutdown, request/response models and tests.

## Phase 2 — Remove Reading/Song implementation
Delete the active V2 code path for:
- `src/modules/reading/**`
- `src/modules/songs/**`
- route registrations/imports
- domain/application/infrastructure types
- request/response/schema files
- repository interfaces
- event names
- playback history
- generic favorites support
- seed records

Search the full tree for `reading`, `readings`, `song`, `songs`, `playback`, `readingId`, `songId`.

Retain a reference only when it is clearly a historical/migration note.

## Phase 3 — Preferences/bootstrap V2
Only `naam_jap` and `meditation` may be enabled or returned.

## Phase 4 — Naam Jap
Mantra catalogue, sessions, idempotency, aggregation.

## Phase 5 — Meditation
Presets, sessions, completion semantics, aggregation.

## Phase 6 — Daily progress/history
V2 goal snapshot, today, history, streak. Only two practices contribute.

## Phase 7 — Notifications
Devices, reminders, timezone-aware delivery.

## Phase 8 — Legacy migration/cleanup
Choose archive-outside-app or temporary isolated retention plus deletion date. Verify no V2 API access.

## Phase 9 — Hardening
Indexes/query plans, backup/restore, rate limits, security review, dependency audit, load/failure/retry tests, observability, release readiness.

## Traceability
Every PR states:
```text
Requirement:
Spec:
Domain rule:
API:
DB:
Tests:
Removal impact:
```

AI tools may implement only approved V2 requirements and may not reintroduce removed features without a future spec update.