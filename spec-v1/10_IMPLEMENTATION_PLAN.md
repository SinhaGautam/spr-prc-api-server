# Spec-Driven Implementation Plan --- Backend V1

## Rule

Implementation proceeds in vertical slices. Each slice must point back
to specifications and tests.

## Phase 0 --- Foundation

Implement only: - project structure - TypeScript configuration -
lint/format - environment configuration - error model -
logging/correlation ID - MongoDB connection abstraction - health
endpoints - test infrastructure

Acceptance: - application starts - test suite runs - database
connectivity is tested - no domain feature yet

## Phase 1 --- Identity & preferences

Specs: - `00_PROJECT_SPEC` - `01_MODULE_SPEC` - `02_DB_SCHEMA` -
`03_API_SPEC` - `06_TEST_SPEC` - `09_SECURITY_PRIVACY_SPEC`

Implement: - auth integration - user profile - preferences -
traditions - focuses - tags - onboarding bootstrap

Acceptance: - user can complete onboarding - preferences are persisted -
authorization tests pass

## Phase 2 --- Reading

Implement: - reading catalogue - reading detail - reading progress -
explicit completion

Acceptance: - published-only discovery - completion is idempotent -
progress is user-owned - reading completion updates today's practice
state

## Phase 3 --- Naam Jap

Implement: - mantra catalogue - session creation - idempotency - daily
aggregation

Acceptance: - 108 repetitions can be completed - offline retry is safe -
duplicate request does not double-count

## Phase 4 --- Meditation

Implement: - presets - session persistence - completion semantics -
daily aggregation

Acceptance: - 5/10/15/20 minute presets work - timer itself remains
client-side - completed minutes update daily progress correctly

## Phase 5 --- Daily progress & history

Implement: - daily goal snapshot - today's progress - calendar history -
current/longest streak

Acceptance: - 3/3 completion is deterministic - songs do not affect
progress - timezone tests pass

## Phase 6 --- Songs

Implement: - song catalogue - filtering - CDN media metadata -
favorites - limited playback events

Acceptance: - song playback works from CDN - favorite works - no daily
progress mutation occurs

## Phase 7 --- Notifications

Implement only after reminder UX is final: - device registration -
reminder preference - scheduled reminder delivery

Acceptance: - timezone respected - disabled reminder stops future
delivery - notifications do not imply song goals

## Phase 8 --- Production hardening

-   indexes verified against query plans
-   backup/restore procedure
-   rate limits
-   security review
-   dependency audit
-   load test critical endpoints
-   failure/retry tests
-   observability
-   App Store release readiness

## Traceability requirement

Every pull request/change must state:

``` text
Requirement:
Spec:
Domain rule:
API:
DB:
Tests:
```

If one of these is not applicable, explicitly state why.

## AI coding rule

AI coding tools may: - generate boilerplate - implement already-approved
functions - generate tests from approved rules - refactor without
changing behaviour

AI coding tools may not: - invent endpoints - invent collections -
invent fields - change business rules - add infrastructure - add
dependencies - change authentication behaviour

without a spec update/approval.
