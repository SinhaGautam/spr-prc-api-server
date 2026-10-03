# Class & Function Creation Specification — V2

## General rule
Create a class/function only for a domain concept, business rule, application use case, infrastructure adapter, or testable contract.

## Required V2 use cases
- `GetBootstrap`
- `UpdatePreferences`
- `ListMantras`
- `CreateNaamJapSession`
- `ListNaamJapSessions`
- `ListMeditationPresets`
- `CreateMeditationSession`
- `ListMeditationSessions`
- `GetTodayGoals`
- `GetTodayProgress`
- `GetProgressHistory`
- `CalculateCurrentStreak`
- `CalculateLongestStreak`
- `ApplyPracticeCompletion`

## Removed use cases
Do not create Reading/Song/playback use cases or generic favorite use cases.

## Required repository interfaces
- `UserRepository`
- `PreferencesRepository`
- `TraditionRepository`
- `FocusRepository`
- `TagRepository`
- `MantraRepository`
- `NaamJapSessionRepository`
- `MeditationPresetRepository`
- `MeditationSessionRepository`
- `DailyGoalsRepository`
- `DailyProgressRepository`

No Reading/Song repository interface is allowed.

## Layer rules
Controllers handle HTTP parsing/validation and map results to responses.
Application use cases orchestrate repositories, idempotency, policy, logging, and error translation.
Domain policies remain deterministic.
Repositories contain persistence only.

## Error/logging
Use typed application errors and centralized HTTP error mapping. Preserve `cause` when translating lower-level failures. Application logs and API trace rules remain governed by `05B_ERROR_LOGGING_TRACE_SPEC.md`.

`try/catch` only for defined translation/recovery/context; `finally` only for owned cleanup. Never swallow failures.

## Naming
- files: kebab-case
- types/classes/interfaces: PascalCase
- functions/constants: camelCase
- Zod schemas: camelCase + `Schema`

Request/response models belong inside the owning module's `presentation/requests` and `presentation/responses` directories.