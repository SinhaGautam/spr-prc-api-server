# Request & Response Model Specification --- Backend V1

## 1. Purpose

Every API endpoint MUST have an explicit input Request Model and output
Response Model.

**Request/Response models belong to the owning module.**

The standalone `05A_REQUEST_RESPONSE_MODEL_SPEC.md` is the global
rulebook. It does NOT replace module-level request/response files.

MongoDB documents are never API models.

``` text
HTTP Request
    ↓
Middleware
    ↓
Module Request Model
    ↓
Zod Request Schema
    ↓
Application Use Case
    ↓
Domain Model
    ↓
Repository Model
    ↓
MongoDB

MongoDB
    ↓
Repository Model
    ↓
Domain/Application Result
    ↓
Module Response Model
    ↓
Zod Response Schema
    ↓
HTTP Response
```

# 2. Module-level contract requirement

Every module exposing an API MUST contain its own request/response
models.

Example:

``` text
src/modules/naam-jap/
├── domain/
├── application/
│   └── use-cases/
├── infrastructure/
├── presentation/
│   ├── controllers/
│   ├── routes/
│   ├── requests/
│   ├── responses/
│   └── schemas/
└── index.ts
```

For example:

``` text
src/modules/naam-jap/presentation/requests/
├── create-naam-jap-session.request.ts

src/modules/naam-jap/presentation/responses/
├── create-naam-jap-session.response.ts
├── list-naam-jap-sessions.response.ts

src/modules/naam-jap/presentation/schemas/
├── create-naam-jap-session.schema.ts
├── list-naam-jap-sessions.schema.ts
```

The exact folder depth may vary only if the project-wide structure
remains consistent.

## 2.1 Modules without HTTP requests

A module that is purely internal and has no external API does not need
HTTP Request/Response files.

It still needs explicit application input/output types where the use
case contract requires them.

# 3. Naming convention

## 3.1 File names

**Required convention: kebab-case.**

Examples:

``` text
create-reading-progress.request.ts
update-reading-progress.request.ts
get-today-progress.response.ts
list-readings.response.ts
create-naam-jap-session.schema.ts
```

Do NOT use:

``` text
CreateReadingProgressRequest.ts
createReadingProgressRequest.ts
create_reading_progress_request.ts
request.ts
response.ts
dto.ts
```

The filename must describe the operation and role.

## 3.2 Type/class names

**Required convention: PascalCase.**

Examples:

``` text
CreateReadingProgressRequest
UpdateReadingProgressRequest
GetTodayProgressResponse
ListReadingsResponse
CreateNaamJapSessionResponse
```

## 3.3 Zod schema names

Use the operation + `Schema`:

``` text
createReadingProgressRequestSchema
updateReadingProgressRequestSchema
getTodayProgressResponseSchema
```

Use camelCase for schema constants.

## 3.4 Controller names

``` text
ReadingController
NaamJapController
MeditationController
SongController
```

File:

``` text
reading.controller.ts
naam-jap.controller.ts
meditation.controller.ts
song.controller.ts
```

## 3.5 Use-case names

Type/class:

``` text
CompleteReading
CreateNaamJapSession
CreateMeditationSession
GetTodayProgress
```

File:

``` text
complete-reading.use-case.ts
create-naam-jap-session.use-case.ts
create-meditation-session.use-case.ts
get-today-progress.use-case.ts
```

## 3.6 Repository names

Interface:

``` text
ReadingRepository
DailyProgressRepository
NaamJapSessionRepository
SongRepository
```

File:

``` text
reading.repository.ts
daily-progress.repository.ts
naam-jap-session.repository.ts
song.repository.ts
```

MongoDB implementation:

``` text
MongoReadingRepository
MongoDailyProgressRepository
MongoNaamJapSessionRepository
MongoSongRepository
```

File:

``` text
mongo-reading.repository.ts
mongo-daily-progress.repository.ts
```

## 3.7 Domain model names

``` text
Reading
NaamJapSession
MeditationSession
DailyGoal
DailyProgress
Song
```

Files:

``` text
reading.ts
naam-jap-session.ts
meditation-session.ts
daily-goal.ts
daily-progress.ts
song.ts
```

Avoid suffixing domain entities with `Model` unless technically
required.

# 4. Request model rules

Every endpoint must specify:

-   path parameter model, if applicable
-   query parameter model, if applicable
-   body request model, if applicable
-   validation rules
-   optional/default semantics
-   authorization context

Example:

``` text
src/modules/naam-jap/presentation/requests/
    create-naam-jap-session.request.ts
```

``` text
CreateNaamJapSessionRequest {
  mantraId?: string
  mantraText?: string
  targetRepetitions: number
  completedRepetitions: number
  startedAt: string
  endedAt?: string
  durationSeconds: number
  completed: boolean
  clientSessionId: string
}
```

# 5. Response model rules

Every endpoint must specify its successful response.

Example:

``` text
src/modules/naam-jap/presentation/responses/
    create-naam-jap-session.response.ts
```

``` text
CreateNaamJapSessionResponse {
  id: string
  mantra: {
    id?: string
    text: string
  }
  completedRepetitions: number
  targetRepetitions: number
  completed: boolean
  startedAt: string
  endedAt?: string
  dailyProgress: {
    repetitions: number
    targetRepetitions: number
    completed: boolean
  }
}
```

The response is designed for the mobile use case, not copied from
MongoDB.

# 6. Zod schema location

Request and response schemas belong to the same module.

``` text
presentation/
├── requests/
├── responses/
└── schemas/
```

Example:

``` text
requests/create-reading-progress.request.ts
responses/update-reading-progress.response.ts
schemas/update-reading-progress.schema.ts
```

A schema may validate both input and output if that is explicitly named
and scoped, but separate request/response schemas are preferred for
clarity.

# 7. Domain/application vs HTTP models

Do not pass HTTP request models directly through the entire application.

Preferred:

``` text
CreateNaamJapSessionRequest
        ↓
CreateNaamJapSessionCommand
        ↓
NaamJapSession domain operation
```

And:

``` text
Domain Result
        ↓
CreateNaamJapSessionResponse
```

This prevents HTTP concerns from leaking into business logic.

# 8. No generic DTO folders

Do not create:

``` text
src/dto/
src/models/
src/types/
```

as a dumping ground for unrelated API contracts.

Models belong to their owning module.

Shared models may exist only when they represent a genuinely shared
contract.

# 9. Error response

Global standard:

``` text
ErrorResponse {
  error: {
    code: string
    message: string
    requestId: string
    details?: unknown
  }
}
```

The global error response contract may live in:

``` text
src/shared/presentation/responses/error.response.ts
```

and:

``` text
src/shared/presentation/schemas/error-response.schema.ts
```

Feature modules must not create different error envelopes.

# 10. List response convention

Example:

``` text
ListSongsResponse {
  items: SongSummaryResponse[]
  nextCursor?: string
}
```

File:

``` text
list-songs.response.ts
```

Do not expose MongoDB cursors.

# 11. File-to-type traceability

A request file should normally contain the request model for that
operation:

``` text
create-song.request.ts
    → CreateSongRequest
```

A response file:

``` text
create-song.response.ts
    → CreateSongResponse
```

A schema file:

``` text
create-song.schema.ts
    → createSongRequestSchema
    → createSongResponseSchema
```

If a file contains multiple unrelated contracts, split it.

# 12. Endpoint implementation checklist

An endpoint is NOT implementation-ready until the module contains:

``` text
[ ] request model
[ ] request Zod schema
[ ] response model
[ ] response Zod schema
[ ] error cases
[ ] controller/route contract
[ ] application use case
[ ] authorization rule
[ ] logging/trace requirements
[ ] unit tests
[ ] integration/contract tests
```

# 13. Example complete module

``` text
src/modules/reading/

├── domain/
│   ├── reading.ts
│   └── reading-policy.ts
│
├── application/
│   ├── commands/
│   │   ├── complete-reading.command.ts
│   │   └── update-reading-progress.command.ts
│   └── use-cases/
│       ├── complete-reading.use-case.ts
│       ├── get-reading.use-case.ts
│       ├── list-readings.use-case.ts
│       └── update-reading-progress.use-case.ts
│
├── infrastructure/
│   └── repositories/
│       └── mongo-reading.repository.ts
│
├── presentation/
│   ├── controllers/
│   │   └── reading.controller.ts
│   ├── routes/
│   │   └── reading.routes.ts
│   ├── requests/
│   │   ├── list-readings.request.ts
│   │   └── update-reading-progress.request.ts
│   ├── responses/
│   │   ├── get-reading.response.ts
│   │   ├── list-readings.response.ts
│   │   └── update-reading-progress.response.ts
│   └── schemas/
│       ├── list-readings.schema.ts
│       └── update-reading-progress.schema.ts
│
└── index.ts
```

This structure is illustrative but the naming rules are mandatory.

# 14. Anti-patterns

Forbidden:

``` text
presentation/dto.ts
presentation/request.ts
presentation/response.ts
shared/dto.ts
models/all-models.ts
types/all-types.ts
```

unless an ADR explicitly justifies the structure.

Also forbidden: - exposing MongoDB documents as responses - using `any`
as a request/response model - accepting arbitrary fields - returning
unvalidated provider data - sharing feature-specific request models
between unrelated modules
