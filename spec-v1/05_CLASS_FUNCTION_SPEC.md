# Class & Function Creation Specification

## Purpose

This file governs implementation structure and prevents developers or AI coding tools from inventing architecture while implementing approved requirements.

## General rule

Create a class/function only when it represents a domain concept, isolates a business rule, implements an application use case or infrastructure adapter, or is required by a testable contract. Do not create classes merely to wrap one-line database calls.

## Recommended backend structure

```text
src/
  modules/
    auth/
    users/
    preferences/
    features/
      application/
      entities/
      infrastructure/
      controllers/
      schemas.ts
      routes.ts
      index.ts
    content/
    naam-jap/
    meditation/
    daily-practice/
    progress/
    notifications/
  shared/
    domain/
    application/
    infrastructure/
```

## Layer responsibilities

### Controller / route handler

Allowed: parse request, invoke application service, and map result to HTTP response.

Forbidden: business calculations, MongoDB queries, or authorization logic beyond invoking the authorization policy.

### Application service / use case

Allowed: orchestrate domain operations, repository calls, idempotency handling, and cross-module application workflows. Application services depend on repository interfaces.

### Domain service / policy

Allowed: pure business rules such as completion calculation, streak calculation, target validation, and content selection policy. Prefer deterministic, dependency-light logic that is easy to unit test.

### Repository

Allowed: persistence queries, mapping persistence models, and index-aware query methods. Forbidden: business decisions or HTTP concerns.

### Infrastructure adapter

Examples: MongoDB repository implementation, object-storage signer, notification provider, and authentication provider.

## Required named use cases

### Features
- `ListFeatures` reads all feature records, including inactive records, from MongoDB.
- Feature records have a stable canonical `key` and a required boolean `isActive`.
- No hard-coded or in-memory fallback is permitted.

### Naam Jap
- `ListMantras`
- `CreateNaamJapSession`

### Meditation
- `ListMeditationPresets`
- `CreateMeditationSession`

### Daily practice
- `GetTodayGoals`
- `GetTodayProgress`
- `ApplyPracticeCompletion`

### Progress
- `GetProgressHistory`
- `CalculateCurrentStreak`
- `CalculateLongestStreak`

## Function rules

Functions must have one clear responsibility, use explicit input/output types, reject invalid input at the boundary, avoid hidden global state, and be deterministic unless they are explicitly infrastructure operations.

## Error model

Use typed application errors/categories such as `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `IdempotencyConflictError`, and `DependencyUnavailableError`. Map these to HTTP status codes in one presentation-layer policy.

## DTO rules

Do not expose MongoDB documents directly. Use request models, response models, and persistence models to prevent schema leakage.

## Repository interface rule

Domain/application code depends on repository interfaces. MongoDB implementations live in infrastructure.

## Transaction rule

Use MongoDB transactions only where atomicity is genuinely required. Document consistency decisions in ADRs.

## Anti-patterns

Forbidden without an ADR: generic `BaseRepository<T>`, generic `BaseService<T>`, generic `CRUDController<T>`, singleton domain state, direct collection access from controllers, `any` for domain models, premature CQRS, and event sourcing.

## Application context, logging, and errors

HTTP-triggered application use cases should receive request/principal context where required. Application services must emit meaningful success/failure logs. Errors must be propagated; never silently convert failures into success.

## try/catch/finally

- No blanket catch-and-rethrow.
- Catch only for translation, recovery, meaningful context, or documented policy.
- Preserve original errors as `cause`.
- Use `finally` only for owned resource/state cleanup.

## File and type naming convention

Use kebab-case for files, PascalCase for classes/types/interfaces, and camelCase for functions/constants. Request/response files belong to the owning module. Do not create generic project-wide DTO, models, or types dumping grounds.
