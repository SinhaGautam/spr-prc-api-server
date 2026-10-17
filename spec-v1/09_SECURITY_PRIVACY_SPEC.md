# Security & Privacy Specification — Backend V1

## Authentication
- V1 uses anonymous per-installation identity. Installation does not establish a human-verified identity and does not support guaranteed cross-device recovery.
- The client generates a random UUID installation ID and a cryptographically random installation secret (at least 32 bytes); store the secret only in Android Keystore-backed secure storage or iOS Keychain via a supported secure-storage API.
- Store only SHA-256 hashes of installation secrets and opaque bearer tokens on the server. Generate bearer tokens with a cryptographically secure random generator.
- Access sessions expire after 15 minutes. Validate session expiry and revocation on every protected request. A database TTL index is cleanup only, not an authorization check.
- An installation secret is a long-lived bearer-equivalent credential: never log it, include it in analytics, or transmit it outside HTTPS. Rate-limit session bootstrap and use generic authentication errors.
- Do not accept client-supplied user IDs, provider subjects, usernames, or push tokens as proof of identity.
- Generated usernames are display identifiers only, not credentials. `displayName` is optional and not collected by the V1 UI; V2 may add profile editing.
- `POST /devices` is only for push notification registration after authentication and after a provider token exists. Push tokens are not session credentials.
- Session revocation must be enforced server-side. Session bootstrap resumes the same user only after the installation secret hash matches.
- Reset local data preserves installation credentials and clears only local cache after syncing pending data where possible. “Start fresh” creates a new installation identity; it does not delete the previous server-side user. Account deletion is a separate future capability.
- Plan a V2 account-linking flow to allow a verified identity to attach to the existing anonymous user without losing progress.

## Authorization
All user-owned activity is scoped to the authenticated principal.

## Input validation
Validate IDs, strings, enums, dates, times, durations, repetitions, targets, pagination, and supported practice types.

V1 practice enum:
```text
naam_jap
meditation
```
Reading/Song practice values must be rejected.

## Logging
Do not log tokens, credentials, password hashes, unnecessary personal data, or private mantra text unless approved. Log requestId, route, method, status, duration, error category, and safe user identifier where operationally justified.

## Legacy-feature privacy
Legacy Reading/Song/playback data must not be exposed by V1 mobile APIs. Temporary retention requires restricted migration/retention access outside the mobile API.

## Account deletion
Cover profile, preferences, Naam Jap sessions, Meditation sessions, daily goals/progress, device registrations, all active sessions, and installation records associated with the user. Handle legacy data according to approved migration policy.

## Administration
Admin content changes require auth, authorization, audit trail, and explicit publish/archive.