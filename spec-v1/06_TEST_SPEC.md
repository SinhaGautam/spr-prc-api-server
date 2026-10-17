# Test Specification — Backend V1

## Goal
Tests prove the V1 contract and prove removed V1 features have not leaked back into V1.

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
- no V1 route starts with `/readings` or `/songs`
- bootstrap practice enum excludes Reading/Song
- preferences schema rejects Reading/Song
- daily goal/progress models have no Reading/Song fields
- repository exports contain no Reading/Song repositories
- seed data contains no reading/song/playback/favorite records
- no legacy feature module is imported by V1

## Authentication and installation lifecycle
- First POST /auth/session creates one anonymous user, installation record, generated username, and opaque access session without requiring displayName.
- Repeating bootstrap with the same installation ID and secret returns the same user and a new session token.
- Repeating bootstrap with an incorrect installation secret returns 401 and creates no new session.
- Malformed UUID, short installation secret, invalid platform, and unknown request fields are rejected.
- The bearer token is never stored raw; session lookup hashes the supplied token.
- Session expires after 15 minutes and expired/revoked tokens cannot access protected routes.
- DELETE /auth/session revokes the current token; subsequent protected calls return 401.
- Parallel first-launch requests cannot create duplicate users/installations; duplicate-key races resolve safely or return a retryable conflict without overwriting a registered installation secret.
- Generated username is stable for an installation and does not function as a credential.
- Device metadata is optional/untrusted; push tokens are not used for authentication.
- Reset-local-data semantics preserve installation credentials; “start fresh” generates a new installation identity and does not delete server data.

## Feature availability
- `features` collection uses canonical stable keys and required boolean `isActive`.
- `GET /features` lists both active and inactive MongoDB records, ordered deterministically.
- Feature service reads through the MongoDB repository and contains no hard-coded fallback list.
- Empty feature collection returns an empty list; MongoDB failures are surfaced through the standard error handler.
- Seed data creates the two V1 feature documents as active when the collection is empty.

## API integration
Every V1 endpoint: success, validation failure, auth failure, authorization failure where relevant, not found, duplicate/idempotency, dependency failure where meaningful. Also assert removed paths are not registered.

## DB integration
Verify indexes, pagination, UTC/local-date behavior, atomicity, idempotency, and legacy data isolation.

## Acceptance
### First day
Create account → choose tradition/focus → enable Naam Jap + Meditation → set targets → Today → complete Naam Jap → complete Meditation → Today shows 2/2 → streak qualifies.

### Offline
Lose network → perform Naam Jap locally → reconnect → sync once → progress updates once.

### Removal
Legacy Reading/Song routes unavailable; invalid practice values rejected; bootstrap has only V1 practices; progress has only V1 practice branches.

## Coverage
100% of critical completion/streak/idempotency/removal-isolation rules.