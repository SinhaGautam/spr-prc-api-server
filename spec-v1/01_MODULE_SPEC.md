# Module Specification — Backend V1

## Architecture
src/routes/index.ts -> module routes.ts -> module controllers -> application services/use cases -> repository interfaces -> infrastructure implementations.

## Module ownership
auth: authentication and identity
users: profile/account lifecycle
preferences: user preferences
content: V1 taxonomy and publication metadata
naam-jap: mantra catalogue and japa sessions
meditation: presets, sessions and approved media
daily-practice: daily goal snapshots and aggregation
progress: history and streak read models
notifications: reminder/device delivery
admin-content: approved V1 content administration when implemented
health: liveness/readiness

Reading and Songs/Bhajans are removed from V1.

## Standard API module structure
modules/<module>/
- entities/
- controllers/
- application/
- infrastructure/
- requests/
- responses/
- schemas/
- routes.ts
- index.ts

Unused folders may be omitted, but an API module must have routes.ts and controllers/.

## Entity rule
Every business entity belongs to its owning module's entities directory. No shared business-entity registry.

## Dependency rules
Controllers depend on application services.
Application services depend on repository interfaces and domain policies.
Infrastructure implements repository interfaces.
Entities do not depend on Express or MongoDB.
A module must not directly manipulate another module's persistence.
