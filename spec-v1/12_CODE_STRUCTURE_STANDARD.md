# V1 Code Structure Standard

This is the implementation standard for the complete V1 backend.

## Runtime architecture

HTTP request -> app.ts -> centralized middleware -> routes/index.ts -> module/routes.ts -> Controller -> Application Service -> Repository Port -> Infrastructure Adapter -> MongoDB/provider

Dependency direction: presentation -> application -> domain/entity + ports -> infrastructure.

Controllers never access MongoDB. Application services never import Express Request/Response. Infrastructure never decides HTTP status codes.

## Complete source tree

src/
  core/application/BaseApiService.ts
  core/application/Service.ts
  core/config/Environment.ts
  core/http/BaseController.ts
  core/logging/Logger.ts
  core/persistence/Repository.ts
  core/security/AuthorizationPolicy.ts
  core/validation/Schema.ts
  infrastructure/mongodb/MongoDatabase.ts
  infrastructure/mongodb/MongoIndexes.ts
  middleware/AsyncHandler.ts
  middleware/RequestValidation.ts
  middleware/auth.ts
  middleware/rate-limit.ts
  middleware/request-id.ts
  middleware/security.ts
  modules/{auth,users,preferences,content,naam-jap,meditation,daily-practice,progress,notifications,admin-content,bootstrap,home,health}/
  routes/index.ts
  shared/domain/types.ts
  types/express.d.ts

Business entities are module-owned. Shared contains only genuinely cross-module primitives.

## Standard feature module

application/<UseCase>Service.ts
application/<Module>Repository.ts
controllers/<Module>Controller.ts
contracts/<Module>Request.ts
contracts/<Module>Response.ts
entities/<Module>Entity.ts
infrastructure/InMemory<Module>Repository.ts
infrastructure/Mongo<Module>Repository.ts
schemas/<Module>Schema.ts
routes.ts
index.ts

Use only the folders a module actually needs.

## Naming

Use PascalCase TypeScript filenames: UserController.ts, UserService.ts, UserRepository.ts, UserEntity.ts, UserRequest.ts, UserResponse.ts, UserSchema.ts, BaseApiService.ts, BaseController.ts, MongoUserRepository.ts.

Do not introduce *.controller.ts, *.service.ts, *.repository.ts, *.model.ts, helper.ts, response.ts, or monolithic repositories.ts files.

## Controller

A controller validates external input, obtains the authenticated principal, calls an application service, and maps the result to HTTP.

It must not query MongoDB, contain business rules, instantiate repositories, read process.env, or catch an error only to log and rethrow it.

## Application service

Services contain application use cases and orchestration. They call repository ports, enforce application rules, map entities to response DTOs, throw typed errors, and use BaseApiService.execute() for operation logging/timing.

Services are not forced into CRUD. Meaningful methods such as getProfile(), createSession(), listSessions(), and getTodayView() are preferred.

## Repository

Repository ports belong to the module application layer. Mongo and in-memory implementations belong to module infrastructure.

Generic capabilities in core/persistence/Repository.ts are composable and must not force every module into CRUD.

## Request/response contracts

Every public endpoint has a request model, request Zod schema, response model, response Zod schema, auth policy, error contract, and tests.

Request models are not persistence models. MongoDB documents are never returned directly.

Success envelopes are not introduced globally unless explicitly approved. Errors use the V1 common error envelope.

## Error handling

Use AppError with ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, IdempotencyError, and DependencyError.

Unexpected errors map to INTERNAL_SERVER_ERROR. Public errors contain code, message, and requestId unless safe details are explicitly approved.

Use try/catch only for translation, recovery, required context, or owned cleanup. Do not swallow errors.

## Middleware

Global middleware owns request ID, structured request logging, security headers, CORS, body limits, authentication extraction, rate limiting, and centralized error handling.

Authentication answers who the principal is. Authorization policies decide whether the principal may perform an operation.

## Database

MongoDB lifecycle is owned by infrastructure/mongodb/MongoDatabase.ts. Indexes are owned by MongoIndexes.ts and initialized at startup, never per request.

Each module owns its repository adapter. The old monolithic Mongo repository is removed.

## Composition

modules/<module>/index.ts is the module composition root. It selects adapters, constructs services/controllers, and exports the router and explicitly approved cross-module services.

src/routes/index.ts is only the global route registry.

## V1 modules

Active modules: auth, users, preferences, content, naam-jap, meditation, daily-practice, progress, notifications, admin-content, health.

bootstrap and home are application-facing composition modules.

Reading, Songs, Favorites, playback, and reading-progress modules are not present.

## Public V1 routes

/api/v1 contains only the approved API: /auth/session, /bootstrap, /home/today, /me, /me/preferences, /mantras, /naam-jap/sessions, /meditation/presets, /meditation/sessions, /goals/today, /progress/today, /progress/history, /progress/streak, /me/reminder, /devices, /devices/:deviceId, /health/live, /health/ready.

No generic public content route is mounted because it is not part of the approved API specification.

## Reference module

Users is the reference implementation for the controller/service/repository pattern. Other modules follow the same dependency boundaries while retaining their own domain contracts.

## Forbidden patterns

Direct MongoDB in controllers/services, route-level service construction, process.env in features, generic CRUD services for non-CRUD use cases, shared business entity bags, public endpoints without contracts, raw Zod issue exposure, swallowed errors, duplicate log-and-rethrow blocks, Reading/Songs aliases, generic event endpoints, and hidden legacy APIs are forbidden.