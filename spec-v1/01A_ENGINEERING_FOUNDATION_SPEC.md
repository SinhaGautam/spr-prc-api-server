# Engineering Foundation Specification --- Backend V1

This specification defines the non-feature engineering foundation
required before domain modules are implemented.

## 1. Required backend baseline

V1 backend must include:

-   TypeScript with strict compiler settings
-   Node.js runtime
-   HTTP framework selected by the project
-   Zod for runtime validation and schema contracts
-   centralized middleware pipeline
-   centralized error handling
-   structured logging
-   request/correlation IDs
-   configuration validation
-   authentication middleware
-   authorization policy layer
-   security headers
-   CORS policy
-   rate limiting strategy
-   graceful shutdown
-   health/readiness endpoints
-   MongoDB connection lifecycle
-   API versioning
-   OpenAPI/contract documentation generated from approved API schemas
    where practical
-   automated unit/integration tests
-   linting and formatting
-   environment separation
-   dependency/security checks

No feature module should reimplement these concerns.

## 2. Application bootstrap

Recommended flow:

``` text
process start
   ↓
load environment
   ↓
validate environment with Zod
   ↓
create logger
   ↓
create HTTP application
   ↓
register security middleware
   ↓
register request ID middleware
   ↓
register request logging
   ↓
register body parser / limits
   ↓
register CORS
   ↓
register authentication extraction
   ↓
register API routes
   ↓
register 404 handler
   ↓
register centralized error handler
   ↓
connect MongoDB
   ↓
start server
```

The exact framework ordering must follow the chosen HTTP framework's
semantics.

## 3. Zod specification

Zod is the required runtime validation library for all
external/untrusted data.

### Validate

-   environment variables
-   HTTP request body
-   path parameters
-   query parameters
-   relevant headers
-   external provider responses where failure could corrupt application
    state

### Do not validate only in TypeScript

TypeScript types disappear at runtime. Every external boundary requires
runtime validation.

### Schema ownership

Schemas should live near the module contract:

``` text
modules/
  reading/
    presentation/
      schemas/
        get-reading.schema.ts
        update-progress.schema.ts
```

Shared schemas may exist only for genuinely shared contracts.

### Input/output distinction

Use separate schemas for: - request input - domain input where
necessary - persistence model - API response

Do not reuse a MongoDB schema directly as an API schema.

### Validation errors

Invalid input must map to a consistent HTTP 4xx response.

Example conceptual response:

``` json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "requestId": "..."
  }
}
```

Do not return internal Zod issue structures directly as the public API
contract unless explicitly approved.

## 4. Middleware pipeline

V1 middleware must be centralized.

Required responsibilities:

### Request ID middleware

-   accept a safe incoming request ID if policy allows
-   otherwise generate one
-   attach it to request context
-   include it in logs
-   return it in response headers

### Security middleware

-   secure HTTP headers appropriate to API use
-   disable unnecessary server identification
-   enforce safe request limits

### CORS middleware

-   explicit allowed origins
-   no wildcard production policy when credentials are used

### Body-size middleware

Define limits for: - JSON requests - URL encoded requests if used

The API must reject unexpectedly large payloads.

### Authentication middleware

-   extract credentials
-   validate token/session
-   attach authenticated principal
-   do not perform business authorization

### Authorization

Authorization is a policy/use-case concern.

Example:

``` text
Authentication → Who is this?
Authorization   → Can this principal perform this operation?
```

### Rate limiting

V1 must define limits for: - authentication endpoints - public discovery
endpoints where needed - write-heavy user activity endpoints

Do not introduce Redis merely to implement rate limiting.

## 5. Error handling

Use one centralized error-handling mechanism.

### Error hierarchy

Conceptually:

``` text
AppError
 ├── ValidationError
 ├── AuthenticationError
 ├── AuthorizationError
 ├── NotFoundError
 ├── ConflictError
 ├── IdempotencyError
 └── DependencyError
```

Unexpected errors are mapped to:

``` text
INTERNAL_SERVER_ERROR
```

without exposing stack traces or internal database details to clients.

### Error response contract

All API errors use the same envelope:

``` json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Reading not found",
    "requestId": "..."
  }
}
```

Optional safe metadata may be included when defined by the API
specification.

### Logging errors

Unexpected errors must log: - request ID - route - method - status -
error type - stack trace internally - safe contextual metadata

Never log secrets.

## 6. Structured logging

Use a structured logger rather than `console.log` for application
logging.

Recommended log fields:

``` text
timestamp
level
service
environment
requestId
route
method
statusCode
durationMs
event
errorCode
```

### Log levels

-   `fatal` --- process cannot safely continue
-   `error` --- failed operation requiring investigation
-   `warn` --- abnormal but handled condition
-   `info` --- important lifecycle/application events
-   `debug` --- development diagnostics

Production should not run with unrestricted debug logging.

### Sensitive-data rule

Never log: - access tokens - refresh tokens - passwords - password
hashes - API keys - push tokens unless explicitly approved - full
request bodies by default - private user content unless required and
approved

## 7. Configuration

All environment configuration must be validated at startup.

Examples:

``` text
NODE_ENV
PORT
MONGODB_URI
MONGODB_DATABASE
AUTH_*
CORS_ORIGINS
LOG_LEVEL
MEDIA_*
NOTIFICATION_*
```

Do not allow the application to start with missing mandatory production
configuration.

Never hardcode secrets.

Use typed configuration:

``` text
EnvSchema → parsed Config → application
```

Feature modules must not read `process.env` directly.

## 8. Authentication and authorization boundary

Authentication provider details are infrastructure.

Application code consumes an authenticated principal:

``` text
AuthenticatedPrincipal {
  userId
  authProvider
  roles[]
}
```

Authorization rules remain in application/domain policy.

Example:

``` text
GET /reading-progress
    ↓
principal.userId
    ↓
query only that user's progress
```

Never accept a mobile-provided user ID as the authority for ownership.

## 9. Database infrastructure

MongoDB infrastructure must provide:

-   connection startup
-   connection health
-   graceful close
-   timeout configuration
-   repository access
-   transaction/session support where required
-   index creation/migration strategy

Repositories must not create indexes on every request.

Index definitions belong in controlled database setup/migration code.

## 10. API observability

Every request should be measurable without collecting unnecessary
personal data.

Minimum metrics/logging: - request count - latency - error count - HTTP
status distribution - dependency failure - database latency where
practical

Business analytics are separate from operational observability.

Do not build a generic event-analytics system for V1.

## 11. Graceful shutdown

On termination signal:

``` text
stop accepting new requests
        ↓
finish in-flight requests where practical
        ↓
close notification/provider clients
        ↓
close MongoDB
        ↓
exit
```

Shutdown must have a bounded timeout.

## 12. Health endpoints

### Liveness

`GET /health/live`

Answers:

> Is the process alive?

Should not fail merely because MongoDB is temporarily unavailable.

### Readiness

`GET /health/ready`

Answers:

> Can this instance safely serve application traffic?

Must verify required dependencies.

Do not expose credentials or internal dependency details in health
responses.

## 13. Security headers and HTTP hardening

Apply framework-appropriate security headers.

Also: - disable unnecessary framework banners - reject malformed
requests - constrain payload sizes - use HTTPS in deployed
environments - enforce secure cookie settings if cookies are used

## 14. API contract discipline

The API contract is defined in `03_API_SPEC.md`.

Implementation must not create an endpoint merely because a database
operation exists.

For every endpoint: - Zod request schema - Zod/typed response schema -
authentication requirement - authorization requirement - success
status - failure statuses - idempotency behaviour where applicable -
tests

## 15. Dependency discipline

Before adding a package, document:

``` text
Why needed?
Why existing dependency is insufficient?
Security/maintenance status?
Runtime impact?
V1 requirement?
```

Do not add: - Redis client - Kafka client - ORM/ODM abstraction -
generic event bus - analytics SDK - queue framework

without an approved requirement/ADR.

## 16. Testing engineering foundation

Before feature development: - config validation tests - middleware
tests - error mapping tests - authentication middleware tests -
authorization tests - request ID tests - rate-limit tests where
implemented - health endpoint tests - MongoDB connection/repository test
setup

## 17. Definition of done

The engineering foundation is complete when: - invalid environment
configuration fails startup clearly - invalid API input is rejected
consistently - every request has a traceable request ID - errors use the
common response envelope - structured logs are emitted - secrets are
absent from logs - authentication and authorization are centrally
enforced - health/readiness work - graceful shutdown works - tests cover
the foundation
