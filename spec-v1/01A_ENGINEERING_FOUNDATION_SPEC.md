# Engineering Foundation Specification — Backend V1

## Routing
The application has one common route registry at src/routes/index.ts.

app -> /api -> /v1 -> module routes -> controller.

The common registry is composition-only. Module routes bind paths and middleware to controllers.

## Controllers
Every API module exposing HTTP endpoints must have a controller.

Controllers validate request input, obtain the authenticated principal, invoke application services, map results to response models, select HTTP status and emit safe request-scoped logs.

Controllers must not contain business rules or database access.

## Application services
Application services orchestrate workflows, call repository interfaces, apply application policies, handle idempotency where required, translate dependency failures and log meaningful events.

A service does not have to be CRUD.

## Repositories
Use capability-based generic contracts:
- IRepository<TEntity, TId>
- IMutableRepository<TEntity, TId>
- IReadRepository<TEntity, TId>

Module repositories extend the smallest suitable contract and add module-specific methods.

Infrastructure implements repository interfaces. Repositories do not contain HTTP concerns or business decisions.

## Entity ownership
Business entities live in the owning module's entities directory. shared/domain contains only genuinely cross-module primitives and types, not business entity models.

## Validation and errors
All untrusted external input is validated with Zod. Request and response models are separate from entities and persistence documents.

Use centralized typed errors and the common error envelope. Never expose secrets, stack traces or database details.

## Observability
Every request is traceable by request ID. Controllers and application services emit meaningful structured logs without sensitive data.
