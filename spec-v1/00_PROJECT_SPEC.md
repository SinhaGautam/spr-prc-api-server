# Bhakti App Backend --- V1 Specification

**Document status:** Baseline specification for App Store V1\
**Method:** Specification-Driven Development (SDD)\
**Implementation rule:** No feature, class, function, collection,
endpoint, or background job is implemented unless it is traceable to an
approved requirement in this specification set.

## 1. Product intent

Bhakti is a quiet spiritual companion whose purpose is:

> **A simple app that helps you stay connected to God every day.**

The product should create a feeling of **stillness, stability,
reverence, and gentle continuity**. It is not a productivity tracker,
social network, entertainment feed, or competitive habit app.

The supplied prototype is a **visual/interaction reference only**. Its
hardcoded labels, screen structure, content, taxonomy, and data
assumptions are not authoritative.

## 2. V1 product boundary

### Daily-practice features

Only these two practices participate in daily goals, daily progress, and streaks:

1. Naam Jap
2. Meditation

Reading and Songs/Bhajans are not part of V1.

## 3. V1 user journey

1.  First launch
2.  Quiet introduction
3.  Choose spiritual tradition
4.  Optionally choose a primary devotional focus
5.  Choose which daily practices to include
6.  Optionally enable a daily reminder
7.  Arrive at Today/Home
8.  Complete one or more practices
9.  See a simple completion state
10. Return on later days

The onboarding must not feel like a questionnaire. Personalisation is
limited to choices that materially improve the first Home experience.

## 4. V1 feature decisions

| Capability | V1 decision |
|---|---|
| Home / Today | Required |
| Naam Jap | Required |
| Meditation | Required |
| Daily goals | Required for Naam Jap + Meditation only |
| Progress/history | Required |
| Streak | Required, simple |
| Reading | Removed from V1 |
| Songs/Bhajans | Removed from V1 |
| Playback history | Removed |
| Favorites | Removed |
| Guided meditation | Excluded unless a verified content set is ready |
| Meditation timer | Required |
| Meditation bell | Required |
| Meditation background audio | Optional, maximum 1–2 curated assets |
| Social/community | Excluded |
| Chat/AI guru | Excluded |
| Leaderboards/XP/badges | Excluded |
| Creator uploads | Excluded |
| User-generated spiritual content | Excluded |
| Payments/subscriptions | Excluded unless separately approved |
| Kafka | Excluded |
| Redis | Excluded |
| Microservices | Excluded |

## 5. Naam Jap definition

V1 Reading is **short, curated spiritual reading**, not an attempt to
digitize every scripture.

A reading item may be: - a verified short scripture passage - a short
prayer/stotra excerpt where licensing and textual verification permit -
a short devotional reflection - a short story/teaching - a curated daily
reflection

Every canonical religious quotation must have provenance metadata.

Minimum reading metadata: - title - short description - tradition -
optional devotional focus - language - content type - body - estimated
reading time - source/provenance - status - publication date/version

Recommended V1 reading experience: - one featured reading on Today - a
small browse library - continue/recent reading - explicit
`Complete reading` action - no pressure to read a fixed amount of
scripture every day

## 6. Naam Jap definition

Naam Jap is a focused counting practice.

V1: - user chooses a mantra/name from the available library or their
configured default - preset target defaults may include 108 - user taps
to count - session can be paused/resumed - completed session is
persisted - completed repetitions contribute to today's Naam Jap
progress - accidental multi-taps must be guarded against - count must be
reliable across app backgrounding/relaunch where practical

The backend records **sessions**, not every tap.

## 7. Meditation definition

V1 meditation is deliberately simple:

-   timer-based practice
-   presets: 5, 10, 15, 20 minutes
-   optional custom duration may be deferred
-   silent mode is the default
-   soft start/end bell is supported
-   optional ambient audio can be added as a small curated set
-   no ad-supported audio
-   no aggressive guided-content catalogue

A meditation session becomes completed when the defined completion rule
is met. Abandoned/partial sessions are retained only if needed for
analytics/history; they do not automatically count as completed.

## 8. Spiritual taxonomy

### Tradition
Examples: Hindu, Jain.

### Devotional focus
Optional personalisation preference such as Rama, Krishna, Shiva, Hanuman, Ganesha, Durga, Mahavira.

### Practice
Only:
- naam_jap
- meditation

### Content tags
Examples: peace, devotion, courage, compassion, gratitude, remembrance, morning, evening, festival.

## 9. Daily-goal semantics

A user's enabled practices define the daily goal set.

Each practice has one target:
- Naam Jap: repetition target
- Meditation: minute target

A day is complete when all enabled practices reach their completion criteria.

Disabled practices are not treated as missed. Changing a goal today must not rewrite historical days.

## 10A. Engineering foundation

The backend foundation is part of V1, not optional implementation detail.

Required platform concerns:
- strict TypeScript
- Zod runtime validation
- centralized middleware
- authentication and authorization
- structured logging
- request/correlation IDs
- typed environment configuration
- centralized error handling
- CORS/security headers
- request/body limits
- rate limiting strategy
- health/readiness
- graceful shutdown
- MongoDB lifecycle management
- API contract validation
- test/lint/format/security tooling

Detailed requirements: `01A_ENGINEERING_FOUNDATION_SPEC.md`.

## 10. Architecture

``` text
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
   application data   audio/images/media
        |
        v
 Optional notification provider
```

Backend style: **modular monolith**.

Modules are separated by domain but deployed as one service in V1.

## 10B. API contract and observability

Every API endpoint MUST have an explicit Request Model, Response Model, Zod validation schemas, error contract, authentication/authorization contract, request tracing, and logging behaviour.

Business/application logic must use typed errors and meaningful structured logs. Errors must never be swallowed. `try/catch` is used only for translation, recovery, contextual handling, or documented policy; `finally` is used only for owned cleanup.

See:
- `05A_REQUEST_RESPONSE_MODEL_SPEC.md`
- `05B_ERROR_LOGGING_TRACE_SPEC.md`

## 11. Infrastructure decisions

### MongoDB

System of record for: - users - preferences - content metadata - reading
progress - practice sessions - daily goals/progress - favorites -
limited playback history

### Object storage + CDN

Used for: - song audio - meditation ambient audio - cover artwork -
reading images where required

Audio must never be streamed through the Node.js API.

### Redis

**Not a V1 dependency.**

Add only when measured needs justify: - hot-content cache - distributed
rate limiting - ephemeral state - job coordination

### Kafka

**Not a V1 dependency.**

There is no V1 requirement for high-volume event streaming or multiple
independent consumers.

### Background jobs

Use a simple worker/queue only if required for: - notification
scheduling - media processing - maintenance jobs

Do not introduce Kafka merely to implement background work.

## 12. Backend modules

1. auth
2. users
3. preferences
4. content
5. naam-jap
6. meditation
7. daily-practice
8. progress
9. notifications
10. admin-content
11. health

## 13. Data ownership

Each module owns its domain rules.

Examples: - `naam-jap` owns session/count validation -
owns session/count validation - `meditation` owns session completion
semantics - `daily-practice` owns the daily aggregation model - `songs`
owns song discovery metadata and playback history - `preferences` owns
user personalisation - `content` owns publication state and shared
taxonomy references

No module directly manipulates another module's MongoDB collection
without an explicitly specified application-level contract.

## 14. API principles

-   REST over HTTPS
-   authenticated endpoints derive `userId` from the authenticated
    principal
-   never accept arbitrary `userId` from mobile clients for user-owned
    resources
-   resource names are nouns
-   validation is mandatory at the boundary
-   business rules live in application/domain services, not controllers
-   API response contracts are versioned
-   write operations should be idempotent where duplicate requests are
    realistic

## 15. Offline-first expectations

At minimum:
- Naam Jap counting can continue locally
- meditation timer runs locally
- completed Naam Jap/Meditation sessions are queued for synchronization
- sync retries safely
- duplicate session submission must not create duplicate progress

The backend remains authoritative after synchronization.

## 16. Security and privacy baseline

-   HTTPS only
-   secrets outside source control
-   password credentials, if implemented, must use a modern password
    hashing scheme
-   no raw authentication tokens in logs
-   input validation on every write endpoint
-   authorization checks on every user-owned resource
-   least-privilege database credentials
-   audit logging for administrative content changes
-   user data deletion/export requirements must be supported by the
    chosen privacy design
-   do not collect location, contacts, microphone, or unnecessary device
    data for V1

## 17. Definition of done for backend V1

A backend feature is complete only when: 1. its requirement exists in a
spec 2. its domain rules are documented 3. its request/response contract
is documented 4. persistence requirements are documented 5. indexes are
documented 6. unit tests are specified 7. integration tests are
specified 8. failure cases are specified 9. authorization rules are
specified 10. implementation is reviewed against the spec

## 18. Specification index

  -----------------------------------------------------------------------
  File                                Purpose
  ----------------------------------- -----------------------------------
  `01_MODULE_SPEC.md`                 Module boundaries and
                                      responsibilities

  `02_DB_SCHEMA.md`                   MongoDB collections, fields,
                                      indexes, invariants

  `03_API_SPEC.md`                    V1 API contracts

  `04_DOMAIN_RULES.md`                Business rules and state
                                      transitions

  `05_CLASS_FUNCTION_SPEC.md`         Rules for creating
                                      classes/functions/services

  `06_TEST_SPEC.md`                   Unit, integration, contract,
                                      security and acceptance tests

  `07_CONTENT_SPEC.md`                Reading, mantra, meditation and
                                      song content model/governance

  `08_OFFLINE_SYNC_SPEC.md`           Local persistence and
                                      synchronization rules

  `09_SECURITY_PRIVACY_SPEC.md`       Backend security/privacy
                                      requirements

  `10_IMPLEMENTATION_PLAN.md`         Ordered implementation stages and
                                      traceability

  `11_ADR.md`                         Architecture decisions and rejected
                                      alternatives
  -----------------------------------------------------------------------

## 19. Change-control rule

If implementation discovers a requirement not covered here: - stop -
record the gap - update the relevant spec - review impact on
DB/API/tests - then implement

**Do not solve specification gaps by inventing behaviour inside code.**
