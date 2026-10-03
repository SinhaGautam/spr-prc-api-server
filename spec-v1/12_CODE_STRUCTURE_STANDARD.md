# V1 Code Structure & Application Architecture Standard

## 1. Purpose

This document is the canonical implementation standard for the V1 TypeScript backend.

The codebase uses a modular layered architecture:

```
HTTP
  ↓
src/routes/index.ts
  ↓
module/routes.ts
  ↓
Controller
  ↓
Application Service
  ↓
Repository Port
  ↓
Infrastructure Adapter
  ↓
MongoDB
```

The architecture is based on established service-layer, repository and dependency-injection patterns: controllers handle transport concerns, application services coordinate use cases, and repositories isolate persistence concerns. citeturn2search0turn2search5

## 2. Common route registry

`src/routes/index.ts` is the only application-wide route registry.

Responsibilities:
- API version mounting
- module router mounting
- common middleware composition where appropriate

It must not:
- validate request bodies
- call services
- access repositories
- construct response models
- contain business rules

Express routers are deliberately used as modular, mountable routing units. citeturn3search0

## 3. Module routes

Each HTTP module owns a `routes.ts`.

`routes.ts` contains only:
- HTTP method/path
- middleware
- controller handler binding

Example:

```ts
router.get("/", requireAuthentication, controller.getProfile.bind(controller));
router.put("/", requireAuthentication, controller.updateProfile.bind(controller));
```

No application logic belongs in `routes.ts`.

## 4. Controllers

Controller naming:

```text
UserController.ts
MeditationController.ts
NaamJapController.ts
```

Controllers:
- receive Express `Request`
- validate/parse HTTP input
- obtain authenticated identity
- call application services
- map service results to response DTOs
- select HTTP status
- return the HTTP response

Controllers must not:
- query MongoDB
- contain business rules
- instantiate repositories
- perform persistence mapping
- implement workflows

Constructor dependency injection is required so controllers remain testable and dependencies are explicit. Constructor injection is a common enterprise DI pattern. citeturn0search1turn0search17

## 5. Application services

Application service naming:

```text
UserService.ts
MeditationService.ts
NaamJapService.ts
DailyPracticeService.ts
```

Application services:
- implement application use cases
- coordinate repositories and domain objects
- enforce application-level policies
- handle idempotency/workflow rules
- map domain failures to application errors

Services must not receive Express `Request` or `Response`.

A service may expose multiple meaningful use-case methods. It does not have to implement CRUD.

The service layer exists to define application operations and coordinate the application's response; it should not become a dumping ground for every domain rule. citeturn2search0turn2search6

## 6. BaseApiService

`src/core/application/BaseApiService.ts` is a small cross-cutting base class.

It provides:
- consistent application-operation logging
- operation duration measurement
- error logging with context
- error propagation

It must not:
- know Express
- create HTTP responses
- know MongoDB
- contain business rules
- convert every service into CRUD

Example:

```ts
export class UserService extends BaseApiService {
  async getProfile(userId: string): Promise<UserProfileResponse> {
    return this.execute(
      "users.getProfile",
      async () => {
        const user = await this.userRepository.findById(userId);

        if (!user) {
          throw new NotFoundError("User profile not found", { userId });
        }

        return this.toProfileResponse(user);
      },
      { userId },
    );
  }
}
```

## 7. BaseController

`src/core/http/BaseController.ts` provides only common HTTP response helpers such as:
- `ok()`
- `created()`
- `noContent()`

It must not contain application logic.

## 8. Request and response contracts

HTTP contracts are module-owned:

```text
modules/users/
├── contracts/
│   ├── UserRequest.ts
│   └── UserResponse.ts
└── schemas/
    └── UserSchema.ts
```

Rules:
- request contracts describe application input
- response contracts describe public API output
- Zod schemas validate external input
- domain entities are never exposed directly as API responses
- MongoDB documents are never exposed directly as API responses

## 9. Entities

Business entities belong to the owning module:

```text
modules/users/entities/UserEntity.ts
modules/meditation/entities/MeditationSessionEntity.ts
modules/naam-jap/entities/NaamJapSessionEntity.ts
```

Use the `Entity` suffix for business entities.

Shared core/domain code may contain:
- primitives
- value types
- cross-module enums/types
- domain errors where genuinely shared

It must not become a shared business-entity dumping ground.

## 10. Repository ports

Repository contracts are persistence ports.

Generic capabilities are intentionally composable:

```ts
Repository<TEntity, TId>
CreateRepository<TEntity>
UpdateRepository<TEntity>
DeleteRepository<TId>
ReadWriteRepository<TEntity, TId>
```

A module repository extends only the capabilities it actually requires.

Example:

```ts
export interface UserRepository
  extends Repository<UserEntity, string>,
    UpdateRepository<UserEntity> {
  findById(id: string): Promise<UserEntity | null>;
}
```

Non-CRUD use cases must not be forced into `ReadWriteRepository`.

The repository boundary exists to isolate domain/application code from persistence details. citeturn2search5

## 11. Infrastructure

Infrastructure implementations live under the module or database adapter boundary.

Application code depends on repository ports, never on MongoDB collections.

The composition root wires:

```text
Repository implementation
        ↓
Application Service
        ↓
Controller
        ↓
Module Router
```

## 12. Error handling

Express 5 automatically forwards rejected promises from async route handlers to error middleware, so controllers should not use repetitive catch-and-rethrow blocks merely to forward errors. citeturn1search0turn1search1

Use `try/catch` only when:
- translating an infrastructure error
- recovering from an expected failure
- adding meaningful context before rethrowing
- performing a documented fallback

Use `finally` only when the code owns a resource that requires cleanup.

## 13. Naming convention

Use PascalCase filenames for classes and contracts:

```text
UserController.ts
UserService.ts
UserEntity.ts
UserRepository.ts
UserRequest.ts
UserResponse.ts
UserSchema.ts
BaseApiService.ts
BaseController.ts
Repository.ts
Service.ts
```

Do not use:
- `*.controller.ts`
- `*.service.ts`
- `*.model.ts`
- `*.repository.ts`
- generic `helper.ts` files for unrelated functionality

The filename must communicate the role of the artifact.

## 14. Reference module

The `users` module contains the canonical V1 reference implementation for this architecture.

New modules must follow the same boundaries before introducing module-specific variations.

## 15. Explicit anti-patterns

Do not introduce:
- controllers containing database calls
- services receiving Express request/response objects
- routes containing business logic
- repositories returning HTTP DTOs
- MongoDB documents exposed as API responses
- a generic `BaseCrudService` for every module
- a generic `BaseCrudController` for every module
- a giant shared entity file
- static global repositories
- hidden dependency construction inside business methods
