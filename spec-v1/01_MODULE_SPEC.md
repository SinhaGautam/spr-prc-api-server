# Module Specification — Backend V1

## Architecture

Modular monolith with explicit domain boundaries.

HTTP -> Controller -> Application Service -> Repository Port -> Infrastructure Adapter -> MongoDB/provider.

## Module matrix

| Module | Owns | Does not own |
|---|---|---|
| auth | authentication, session identity | daily practice |
| users | profile/account lifecycle | taxonomy |
| preferences | tradition/focus/practice/target/reminder preferences | content publication |
| content | V1 taxonomy + publication metadata | user progress |
| naam-jap | mantra catalogue + japa sessions | daily aggregation |
| meditation | presets + meditation sessions + approved media references | daily aggregation |
| daily-practice | daily goal snapshot + aggregation | content authoring |
| progress | history/streak read models | raw activity rules |
| notifications | reminder/device delivery | practice completion |
| admin-content | V1 content authoring/publishing boundary | user-owned activity |
| health | liveness/readiness | business logic |
| bootstrap | onboarding composition | user-owned activity |
| home | Today composition | persistence ownership |

Reading and Songs/Bhajans are removed completely. Do not replace them with library, bhajans, listening, playback, or generic event aliases.

## Standard module folders

module/application/<UseCase>Service.ts
module/application/<Module>Repository.ts
module/controllers/<Module>Controller.ts
module/contracts/<Module>Request.ts
module/contracts/<Module>Response.ts
module/entities/<Module>Entity.ts
module/infrastructure/InMemory<Module>Repository.ts
module/infrastructure/Mongo<Module>Repository.ts
module/schemas/<Module>Schema.ts
module/routes.ts
module/index.ts

A module may omit a folder when it has no corresponding responsibility.

## Dependency rules

- Controllers depend on application services.
- Application services depend on module repository ports.
- Infrastructure implements repository ports.
- Controllers do not import MongoDB.
- Application services do not import Express request/response types.
- Business entities are owned by their module.
- Shared contains only stable cross-module primitives.
- Route files are composition-only.
- Module index files are composition roots.

## Cross-module rules

Practice completion flows into daily-practice application logic.
Home and bootstrap may compose application services from other modules.
A module must not directly mutate another module's persistence collection.

## V1 implementation standard

Every public endpoint requires a request model, request Zod schema, response model, response Zod schema, authentication policy, authorization rule where applicable, typed error mapping, structured operation logging, request trace ID, and tests.

## V1 public API

Only endpoints in 03_API_SPEC.md are public. The content module is an internal taxonomy boundary and its generic catalog route is not mounted by the V1 global route registry.