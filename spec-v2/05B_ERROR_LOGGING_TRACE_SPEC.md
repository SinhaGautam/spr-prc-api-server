# Error Handling, Application Logging & API Trace Specification --- V2

## Purpose

The backend must make it possible to trace:

``` text
API Request
 -> Controller
 -> Application Use Case
 -> Domain Logic
 -> Repository/Provider
 -> Database/Provider Result
 -> Application Result
 -> API Response
```

using a correlation/request ID without exposing secrets or private
content.

## Structured logging

**Pino is the recommended V2 logger.**

Do not use `console.log`, `console.error`, or ad-hoc logging inside
application/domain modules.

Recommended fields:

``` text
timestamp
level
service
environment
requestId
event
route
method
statusCode
durationMs
userId (only when operationally justified)
errorCode
```

## API trace logs

Every HTTP request receives a request ID, preferably through:

``` text
X-Request-Id
```

Validate an incoming ID before accepting it; otherwise generate one.

The ID must appear in: - request-start trace - request-completion
trace - application logs - error logs - API error response

Example:

``` json
{
  "level": "info",
  "event": "http.request.completed",
  "requestId": "req_123",
  "method": "POST",
  "route": "/api/v2/naam-jap/sessions",
  "statusCode": 201,
  "durationMs": 84
}
```

Do not log complete request/response bodies by default.

## Application/business logging

Application services MUST log meaningful business/application outcomes.

Examples:

``` text
reading.completed
naam_jap.session.created
meditation.session.completed
daily.progress.updated
daily.goal.completed
song.playback.completed
activity.duplicate_replay
```

Example:

``` json
{
  "level": "info",
  "event": "naam_jap.session.created",
  "requestId": "req_123",
  "userId": "user_456",
  "sessionId": "session_789",
  "repetitions": 108
}
```

Do not log: - passwords - access/refresh tokens - API keys - password
hashes - full reading content - private custom mantra text unless
explicitly approved - unnecessary personal data - push tokens unless
operationally required

## Application context

HTTP-triggered use cases should receive an explicit context where
needed:

``` text
ApplicationContext {
  requestId
  actor
  logger
  clock
}
```

Do not use global mutable request state.

## Error categories

1.  Expected application errors --- validation, not found, conflict,
    authorization, invalid state
2.  Infrastructure errors --- MongoDB/storage/notification failures
3.  Unexpected programming errors --- invariant violations and defects

## try/catch rules

Do NOT mechanically wrap every function in:

``` text
try {
  ...
} catch (error) {
  throw error;
}
```

Use `try/catch` only when it adds defined behaviour:

1.  translate a low-level error
2.  recover/fallback
3.  add meaningful structured context
4.  enforce documented compensation/recovery
5.  handle provider-specific failure

Example:

``` text
try:
    repository.insert()
catch DuplicateKeyError:
    throw ConflictError(..., cause=error)
```

Always preserve the original cause where supported.

## finally rules

Use `finally` when the operation owns a resource/state that must be
cleaned up regardless of success/failure: - release a resource/lock -
close a temporary handle - restore temporary state

Do not add `finally` mechanically to every function.

HTTP request timing cleanup belongs in middleware/interceptor
infrastructure.

## Error propagation

Business/application code MUST NOT swallow failures.

Forbidden:

``` text
catch error:
    log error
    return success
```

unless a documented fallback explicitly requires it.

Expected flow:

``` text
Controller
 -> validate
 -> call use case
 -> return success

Known AppError
 -> centralized error handler
 -> safe HTTP error

Unexpected error
 -> centralized error handler
 -> HTTP 500
 -> server-side stack trace
```

## Central error handler

The global handler must: 1. identify typed AppError 2. map HTTP status
3. map stable error code 4. log appropriately 5. include requestId 6.
hide internal details 7. return standard ErrorResponse

Unexpected errors return a generic client-safe message.

## Repository error translation

Repository/infrastructure may translate driver errors:

``` text
Mongo duplicate key
 -> ConflictError
 -> centralized handler
 -> HTTP 409
```

Never expose raw MongoDB messages.

## Logging levels

  Situation                     Level
  ----------------------------- ------------
  successful request            info/debug
  validation/user input error   info/warn
  expected conflict             info/warn
  suspicious auth activity      warn
  dependency failure            error
  unexpected exception          error
  fatal startup failure         fatal

## Business logs vs analytics

Business logs answer: "Did the backend execute the operation correctly?"

Analytics answer: "How do users behave?"

V2 requires operational/business logs, not a generic analytics event
bus.

## Idempotency trace

Offline-safe writes should log:

``` text
activity.accepted
activity.duplicate_replay
activity.conflicting_replay
```

## Required tests

-   requestId generated/preserved safely
-   requestId appears in error response
-   completion trace contains duration/status
-   expected errors use correct category/level
-   unexpected exceptions produce server-side error logs
-   secrets are redacted
-   duplicate idempotency requests are traceable
-   business completion event is emitted once
-   swallowed exceptions cannot produce false success
