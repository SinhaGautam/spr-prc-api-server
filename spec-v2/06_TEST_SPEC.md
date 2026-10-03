# Test Specification — Backend V2

## Goal
Tests prove the V2 contract and prove removed V1 features have not leaked back into V2.

## Daily goals
Test Naam Jap only, Meditation only, both, none, immutable history, future preference changes, and rejection of Reading/Song practice values.

## Daily progress
Test first activity, accumulation, idempotency, exact day completion, and absence of Reading/Song contribution paths.

## Streak
Test first completed day, consecutive days, missed day, current incomplete day, timezone boundaries/changes, and duplicate submissions.

## Naam Jap
Test negative count rejection, valid count, target reached/exceeded, duplicate clientSessionId, malformed dates, invalid duration, offline retry, mantra snapshot.

## Meditation
Test supported/unsupported presets, completed/interrupted sessions, duplicate clientSessionId, actual duration aggregation, offline retry.

## Removal guard tests
- no V2 route starts with `/readings` or `/songs`
- bootstrap practice enum excludes Reading/Song
- preferences schema rejects Reading/Song
- daily goal/progress models have no Reading/Song fields
- repository exports contain no Reading/Song repositories
- seed data contains no reading/song/playback/favorite records
- no legacy feature module is imported by V2

## API integration
Every V2 endpoint: success, validation failure, auth failure, authorization failure where relevant, not found, duplicate/idempotency, dependency failure where meaningful. Also assert removed paths are not registered.

## DB integration
Verify indexes, pagination, UTC/local-date behavior, atomicity, idempotency, and legacy data isolation.

## Acceptance
### First day
Create account → choose tradition/focus → enable Naam Jap + Meditation → set targets → Today → complete Naam Jap → complete Meditation → Today shows 2/2 → streak qualifies.

### Offline
Lose network → perform Naam Jap locally → reconnect → sync once → progress updates once.

### Removal
Legacy Reading/Song routes unavailable; invalid practice values rejected; bootstrap has only V2 practices; progress has only V2 practice branches.

## Coverage
100% of critical completion/streak/idempotency/removal-isolation rules.