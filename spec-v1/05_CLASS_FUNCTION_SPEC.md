# Class & Function Creation Specification

## Purpose

This file governs implementation structure. It prevents developers/AI
coding tools from inventing architecture while implementing the approved
requirements.

## General rule

Create a class/function only when at least one of these is true: 1. it
represents a domain concept 2. it isolates a business rule 3. it is an
application use case 4. it is an infrastructure adapter 5. it is
required by a testable contract

Do not create classes merely to wrap one-line database calls.

## Recommended backend structure

``` text
src/
  modules/
    auth/
      domain/
      application/
      infrastructure/
      presentation/

    reading/
      domain/
      application/
      infrastructure/
      presentation/

    naam-jap/
    meditation/
    daily-practice/
    progress/
    songs/
    favorites/
    preferences/
    content/
    notifications/

  shared/
    domain/
    application/
    infrastructure/
```

## Layer responsibilities

### Controller / route handler

Allowed: - parse request - invoke application service - map result to
HTTP response

Forbidden: - business calculations - MongoDB queries - authorization
logic beyond calling the authorization policy

### Application service / use case

Allowed: - orchestrate domain operations - transaction boundaries -
repository calls - idempotency handling - cross-module application
workflows

### Domain service / policy

Allowed: - pure business rules - completion calculation - streak
calculation - target validation - content selection policy

Preferred characteristics: - deterministic - dependency-light - easy to
unit test

### Repository

Allowed: - persistence queries - mapping persistence models -
index-aware query methods

Forbidden: - business decisions - HTTP concerns

### Infrastructure adapter

Examples: - MongoDB repository implementation - object-storage signer -
notification provider - authentication provider

## Required named use cases

At minimum, implementation must have explicit use cases for:

### Reading

-   `GetReading`
-   `ListReadings`
-   `UpdateReadingProgress`
-   `CompleteReading`

### Naam Jap

-   `ListMantras`
-   `CreateNaamJapSession`

### Meditation

-   `ListMeditationPresets`
-   `CreateMeditationSession`

### Daily practice

-   `GetTodayGoals`
-   `GetTodayProgress`
-   `ApplyPracticeCompletion`

### Progress

-   `GetProgressHistory`
-   `CalculateCurrentStreak`
-   `CalculateLongestStreak`

### Songs

-   `ListSongs`
-   `GetSong`
-   `RecordPlaybackEvent`

### Favorites

-   `AddFavorite`
-   `RemoveFavorite`
-   `ListFavorites`

## Function rules

Functions must: - have one clear responsibility - use explicit
input/output types - reject invalid input at the boundary - avoid hidden
global state - be deterministic unless they are explicitly
infrastructure operations - avoid throwing generic untyped errors for
expected business failures

## Error model

Use typed application errors/categories, for example:

``` text
ValidationError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
IdempotencyConflictError
ContentUnavailableError
DependencyUnavailableError
```

Map them to HTTP status codes in one presentation-layer policy.

## DTO rules

Do not expose MongoDB documents directly.

Use: - request DTOs - response DTOs - persistence models

This protects the API from schema leakage.

## Repository interface rule

Domain/application code depends on interfaces such as:

``` text
ReadingRepository
NaamJapSessionRepository
MeditationSessionRepository
DailyGoalsRepository
DailyProgressRepository
SongRepository
FavoriteRepository
```

MongoDB implementations live in infrastructure.

## Transaction rule

Use MongoDB transactions only where atomicity is genuinely required.

Do not put every request inside a transaction.

For activity completion + daily progress: - prefer an idempotent
application workflow - use a transaction where the chosen consistency
model requires it - document the decision in ADR

## Anti-patterns

Forbidden without an ADR: - generic `BaseRepository<T>` - generic
`BaseService<T>` - generic `CRUDController<T>` - singleton domain
state - direct collection access from controllers - `any` for domain
models - database-specific types leaking through every layer - event bus
abstractions with no V1 consumer - premature CQRS - event sourcing


## 19. Application context, logging and errors

HTTP-triggered application use cases should receive explicit application context where required, including `requestId`, actor/principal, logger, and clock.

Application services must emit meaningful success/failure logs according to `05B_ERROR_LOGGING_TRACE_SPEC.md`.

Errors must be propagated; never silently convert failures into success.

## 20. try/catch/finally

- no blanket catch-and-rethrow
- catch only for translation, recovery, meaningful context, or documented policy
- preserve original error as `cause`
- use `finally` only for owned resource/state cleanup
- controllers rely on centralized error handling


## 22. File and type naming convention

Use:
- files: `kebab-case`
- classes/types/interfaces: `PascalCase`
- functions/constants: `camelCase`
- Zod schema constants: `camelCase` ending in `Schema`

Examples:

```text
create-reading.use-case.ts
CreateReading

create-reading.request.ts
CreateReadingRequest

create-reading.response.ts
CreateReadingResponse

create-reading.schema.ts
createReadingRequestSchema
createReadingResponseSchema
```

Request/response files belong inside the owning module's `presentation/requests` and `presentation/responses` directories. See `05A_REQUEST_RESPONSE_MODEL_SPEC.md`.

Do not create generic project-wide `dto`, `models`, or `types` dumping grounds.
