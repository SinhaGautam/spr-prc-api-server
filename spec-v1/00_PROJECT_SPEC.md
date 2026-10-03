# Bhakti App Backend — V1 Specification

V1 is limited to Naam Jap and Meditation.

## Architecture
V1 is a modular monolith.

HTTP Request -> src/routes/index.ts -> module routes.ts -> Controller -> Application Service/Use Case -> Repository Interface -> Infrastructure Repository -> MongoDB.

src/routes/index.ts is the single common API route registry. It only mounts module routers and API version prefixes.

Each API module owns routes.ts. Module routes only declare paths, middleware and controller handlers. They contain no business logic, Zod parsing, persistence access or service orchestration.

Every API module exposing HTTP endpoints must have a controller class. Controllers own HTTP concerns only: validation, principal extraction, service invocation, response mapping, HTTP status and safe structured logging.

Application services orchestrate business workflows and depend on repository interfaces. Non-CRUD services must not be forced into CRUD abstractions.

Business entities are module-owned under modules/<module>/entities/. shared/domain/entities.ts is not permitted. Shared domain contains only genuinely cross-module primitives and types.

Common repository/service interfaces live under shared/application/ and are capability-based.

## V1 modules
auth, users, preferences, content, naam-jap, meditation, daily-practice, progress, notifications, admin-content when implemented, and health.

Reading, Songs/Bhajans, playback, favorites and reading progress are not V1 capabilities.

## API contracts
Every public endpoint requires module-owned request and response models, Zod schemas, auth policy, typed errors, trace/logging requirements and tests.

## Engineering foundation
Strict TypeScript, Zod, centralized middleware, auth/authorization, structured logging, request IDs, centralized errors, CORS/security, body limits, rate limiting, health/readiness, graceful shutdown, MongoDB lifecycle, API versioning and automated tests remain mandatory.

try/catch is used only for translation, recovery or meaningful context; finally is only for owned cleanup.
