# Spec-Driven Implementation Plan — Backend V1

## Rule

Implementation proceeds in vertical slices. Each slice must point back to specifications and tests.

## Phase 0 — Foundation

Implement only:
- project structure
- TypeScript configuration
- lint/format
- environment configuration
- error model
- logging/correlation ID
- MongoDB connection abstraction
- health endpoints
- test infrastructure

Acceptance:
- application starts
- test suite runs
- database connectivity is tested
- no domain feature yet

## Phase 1 — Identity & preferences

Specs:
- `00_PROJECT_SPEC`
- `01_MODULE_SPEC`
- `02_DB_SCHEMA`
- `03_API_SPEC`
- `06_TEST_SPEC`
- `09_SECURITY_PRIVACY_SPEC`

Implement:
- auth integration
- user profile
- preferences
- traditions
- focuses
- tags
- onboarding

Acceptance:
- user can complete onboarding
- preferences persist
- authorization tests pass
- only `naam_jap` and `meditation` are accepted as practices

## Phase 2 — Naam Jap

Implement:
- mantra catalogue
- session creation
- idempotency
- daily aggregation

Acceptance:
- valid session persists
- target can be completed
- offline retry is safe
- duplicate request does not double-count

## Phase 3 — Meditation

Implement:
- presets
- session persistence
- completion semantics
- daily aggregation

Acceptance:
- 5/10/15/20 minute presets work
- timer remains client-side
- completed minutes update daily progress correctly

## Phase 4 — Daily progress & history

Implement:
- daily goal snapshot for Naam Jap + Meditation
- today's progress
- calendar history
- current/longest streak

Acceptance:
- 2/2 completion is deterministic
- timezone tests pass
- only Naam Jap and Meditation affect progress

## Phase 5 — Notifications

Implement only after reminder UX is final:
- device registration
- reminder preference
- scheduled reminder delivery

Acceptance:
- timezone respected
- disabled reminder stops future delivery
- reminders reference only active V1 practices

## Phase 6 — Production hardening

- indexes verified against query plans
- backup/restore procedure
- rate limits
- security review
- dependency audit
- load test critical endpoints
- failure/retry tests
- observability
- App Store release readiness

## Explicit V1 removal verification

Before V1 release, search the complete source tree and tests for:
```text
reading
readings
song
songs
playback
readingId
songId
favorites
```

Remove active implementation references, routes, repositories, schemas, seed data, and business logic for these removed features.

Historical specification text may mention them only when documenting that they are removed from V1.

## Traceability requirement

Every pull request/change must state:
```text
Requirement:
Spec:
Domain rule:
API:
DB:
Tests:
Removal impact:
```

If one is not applicable, explicitly state why.

## AI coding rule

AI coding tools may:
- generate boilerplate
- implement already-approved functions
- generate tests from approved rules
- refactor without changing behaviour

AI coding tools may not:
- invent endpoints
- invent collections
- invent fields
- invent Reading/Song features
- invent generic content/playback/favorites APIs
- change business rules
- add infrastructure
- add dependencies
- change authentication behaviour

without a spec update/approval.
