# Bhakti App Backend — V1 Specification

**Document status:** V1 scope specification  
**Method:** Specification-Driven Development (SDD)  
**Primary change:** Remove Reading and Songs/Bhajans from V1 product/backend scope.

## 1. Product intent
Bhakti is a quiet spiritual companion whose purpose is:
> **A simple app that helps you stay connected to God every day.**

V1 deliberately reduces scope around a smaller practice core. The backend must not retain dormant Reading or Songs feature contracts merely for possible future use.

## 2. V1 product boundary
V1 tracked practices are:
1. Naam Jap
2. Meditation

Daily goals, daily progress, history, and streaks are based only on these two practices.

### Explicitly removed from V1
- Reading
- Songs/Bhajans
- Reading daily goal
- Song discovery/listening
- Playback history
- Song favorites
- Reading progress/completion
- Reading content catalogue
- Song catalogue
- Song media delivery
- Reading/song admin workflows
- Reading/song offline cache/sync
- Song/reading business/application events

These capabilities may be reconsidered as a future version. They must not be represented as inactive V1 modules or endpoints.

## 3. V1 user journey
1. First launch
2. Quiet introduction
3. Choose spiritual tradition
4. Optionally choose a primary devotional focus
5. Choose daily practices from Naam Jap and Meditation
6. Configure targets
7. Optionally enable daily reminder
8. Arrive at Today/Home
9. Complete Naam Jap and/or Meditation
10. See daily completion/progress
11. Return on later days

## 4. Feature decisions
| Capability | V1 decision |
|---|---|
| Home / Today | Required |
| Naam Jap | Required |
| Meditation | Required |
| Daily goals | Required for Naam Jap + Meditation only |
| Progress/history | Required |
| Streak | Required, simple |
| Reading | Removed |
| Songs/Bhajans | Removed |
| Playback history | Removed |
| Favorites | Removed from V1 |
| Guided meditation catalogue | Excluded |
| Meditation timer | Required |
| Meditation bell | Required |
| Meditation ambient audio | Optional, 1–2 curated assets |
| Social/community | Excluded |
| Chat/AI guru | Excluded |
| Leaderboards/XP/badges | Excluded |
| Creator uploads | Excluded |
| User-generated spiritual content | Excluded |
| Redis | Not required |
| Kafka | Not required |
| Microservices | Not required |

## 5. Spiritual taxonomy
### Tradition
Examples: Hindu, Jain.

### Devotional focus
Optional user preference such as Rama, Krishna, Shiva, Hanuman, Ganesha, Durga, Mahavira.

### Practice
Only:
- `naam_jap`
- `meditation`

### Content tags
Tags remain only where needed for V1-supported content such as mantra/meditation assets. Do not create deity/category matrices.

## 6. Daily-goal semantics
A user's enabled practices define the daily goal set.

Each practice has one target:
- Naam Jap: repetition target
- Meditation: minute target

A day is complete when every enabled practice reaches its completion criteria. Disabled practices are not missed. Historical daily snapshots are immutable.

If all practices are disabled, the user has no active daily-practice goal; this must not be treated as failure.

## 7. Home / Today
`GET /home/today` is a purpose-built composition endpoint.

It may return:
- greeting/context
- today's goals
- today's progress
- default mantra
- meditation preset

It MUST NOT return reading, song, playback, or favorites data.

## 8. Naam Jap
Retain V1 focused counting:
- curated mantra/name library
- configured default mantra
- target defaults may include 108
- local counting
- pause/resume on client
- backend persists sessions, not individual taps
- client-generated idempotency key
- valid repetitions only
- duplicate submission does not double-count

## 9. Meditation
Timer-first:
- presets: 5, 10, 15, 20 minutes
- timer runs locally
- silent by default
- soft start/end bell
- optional curated ambient assets
- backend records session result, not timer ticks
- partial sessions do not automatically satisfy the daily target

## 10. Architecture
Backend remains a modular monolith:
```text
Expo / React Native
        |
      HTTPS
        |
        v
Node.js + TypeScript Backend
        |
        +--------------------+
        |                    |
        v                    v
   MongoDB Atlas       Object Storage + CDN
 application data     meditation/mantra media
```

No Redis, Kafka, or microservices are added solely because of this scope reduction.

## 11. Engineering foundation
Carry forward the V1 engineering foundation:
- strict TypeScript
- Zod runtime validation
- centralized middleware
- authentication/authorization
- structured logging
- request/correlation IDs
- validated environment configuration
- centralized error handling
- CORS/security headers
- request/body limits
- rate limiting strategy
- health/readiness
- graceful shutdown
- MongoDB lifecycle
- API contract validation
- unit/integration/contract/security testing
- lint/format/security tooling

Every V1 API endpoint MUST have Request Model, Request Zod Schema, Response Model, Response Zod Schema, Error contract, auth policy, request trace/logging requirements, and tests.

Business/application logic uses meaningful structured logs and typed errors. Errors are not swallowed. `try/catch` is used only for translation/recovery/context/documented policy; `finally` only for owned cleanup.

## 12. V1 backend modules
1. `auth`
2. `users`
3. `preferences`
4. `content`
5. `naam-jap`
6. `meditation`
7. `daily-practice`
8. `progress`
9. `notifications`
10. `admin-content`
11. `health`

The repository MUST NOT contain active `reading`, `songs`, or playback-specific modules.

## 13. Data ownership
- `auth`: authentication/session identity
- `users`: profile/account lifecycle
- `preferences`: tradition/focus/enabled practice/targets/reminder
- `content`: V1 taxonomy and publication metadata
- `naam-jap`: mantra catalogue and japa sessions
- `meditation`: presets, sessions, meditation media references
- `daily-practice`: daily snapshots/aggregation
- `progress`: history/streak calculations
- `notifications`: devices/reminder delivery
- `admin-content`: V1 content administration
- `health`: liveness/readiness

No module directly writes another module's persistence structures without an explicit application-level contract.

## 14. Offline expectations
Offline support remains for onboarding/preferences, selected mantra, active Naam Jap, active meditation timer, and unsynced V1 activity sessions.

No V1 offline synchronization exists for Reading, Songs, playback, or reading progress.

## 15. Security/privacy
Carry forward the V1 security/privacy rules. V1 must not expose legacy Reading/Song/playback data through the mobile API.

For legacy data, use the explicit retention/migration policy in V1 DB and implementation specs.

## 16. Definition of done
A feature is complete only when its requirement, domain rules, request/response contracts, persistence/indexes, failure cases, authorization, logs/traces, and tests are documented.

## 17. Change control

V1 implementation may not reintroduce Reading or Songs/Bhajans through hidden endpoints, generic content/events, dormant modules, or seed-only data. Reintroduction requires an approved future specification change.