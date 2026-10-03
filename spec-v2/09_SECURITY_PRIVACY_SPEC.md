# Security & Privacy Specification — Backend V2

## Authentication
Retain secure token/session validation, expiry/revocation, and secret redaction.

## Authorization
All user-owned activity is scoped to the authenticated principal.

## Input validation
Validate IDs, strings, enums, dates, times, durations, repetitions, targets, pagination, and supported practice types.

V2 practice enum:
```text
naam_jap
meditation
```
Reading/Song practice values must be rejected.

## Logging
Do not log tokens, credentials, password hashes, unnecessary personal data, or private mantra text unless approved. Log requestId, route, method, status, duration, error category, and safe user identifier where operationally justified.

## Legacy-feature privacy
Legacy Reading/Song/playback data must not be exposed by V2 mobile APIs. Temporary retention requires restricted migration/retention access outside the mobile API.

## Account deletion
Cover profile, preferences, Naam Jap sessions, Meditation sessions, daily goals/progress, and device registrations. Handle legacy data according to approved migration policy.

## Administration
Admin content changes require auth, authorization, audit trail, and explicit publish/archive.