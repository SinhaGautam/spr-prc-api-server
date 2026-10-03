# Security & Privacy Specification --- Backend V1

## Authentication

The selected authentication provider must support secure token/session
handling.

Backend requirements: - validate issuer/audience/signature where
applicable - expire credentials appropriately - never log access
tokens - never return password hashes

## Authorization

For every user-owned resource:

``` text
authenticated principal
        ↓
resource ownership check
        ↓
authorized operation
```

A client must never be able to supply another user's ID to bypass
ownership.

## Input validation

Validate: - string length - enum values - ObjectId/public ID format -
dates - durations - counts - pagination limits - filter values - content
status transitions

Reject unknown/unsupported state transitions.

## Rate limiting

V1 can use provider-level/API-gateway limits or application-level
limits.

Redis is not required solely for rate limiting at V1 scale.

If distributed rate limiting becomes necessary, record an ADR before
introducing Redis.

## Logging

Logs must not contain: - access tokens - password hashes - private
authentication credentials - unnecessary personal data

Log: - request correlation ID - route - status - duration - error
category - safe user identifier/hash where operationally justified

## Content administration

Administrative content changes require: - authenticated admin -
authorization - audit trail - explicit publish/archive action

## Data minimisation

V1 should avoid collecting: - location - contacts - microphone
recordings - health information - precise behavioural telemetry
unrelated to the product

## Account deletion

The backend must support a defined account deletion process.

Deletion policy must specify: - user profile - preferences - reading
progress - activity sessions - favorites - device registrations -
playback history

Content owned by the platform is not deleted when a user account is
deleted.

## Privacy documentation dependency

Before App Store submission, map actual collected data and third-party
SDK/provider behaviour to the current Apple privacy disclosure
requirements and the app's privacy policy.

Do not claim "no data collected" merely because the app does not
intentionally collect analytics; verify SDK/provider behaviour.
