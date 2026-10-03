# Module Specification — Backend V1

## Architecture
Modular monolith: one deployable backend, explicit domain boundaries.

## Module matrix
| Module | Owns | Does not own |
|---|---|---|
| auth | authentication, identity | daily practice |
| users | profile/account lifecycle | taxonomy |
| preferences | tradition/focus/practice/target/reminder preferences | content publication |
| content | V1 taxonomy + publication metadata | user progress |
| naam-jap | mantra catalogue + japa sessions | daily aggregation |
| meditation | presets + meditation sessions + approved meditation media | daily aggregation |
| daily-practice | daily goal snapshot + aggregation | content authoring |
| progress | history/streak read models | raw activity rules |
| notifications | reminder/device delivery | practice completion |
| admin-content | V1-supported content authoring/publishing | user-owned activity |
| health | liveness/readiness | business logic |

## Removed modules
V1 `reading` and `songs` modules are removed entirely in V1. Do not replace them with hidden aliases such as `library`, `bhajans`, `listening`, or generic playback modules.

## Dependencies
```text
Controllers
  ↓
Application use cases/services
  ↓
Domain services/policies
  ↓
Repository interfaces
  ↓
Infrastructure
  ↓
MongoDB/providers
```

Practice completion flows into `daily-practice` application logic; practice modules do not mutate arbitrary progress fields.

## Module responsibilities

### preferences
- tradition
- optional primary focus
- enabled practices: `naam_jap`, `meditation`
- target values
- reminder and language

### content
- V1-supported publication state
- tradition/focus/tag references
- provenance where required

### naam-jap
- list curated mantras
- create sessions
- validate count/duration
- idempotency

### meditation
- expose timer presets
- create sessions
- validate duration/completion
- expose configured ambient assets where enabled

### daily-practice
- date-specific goals
- consume activity completion results
- calculate day completion
- preserve historical snapshots

### progress
- today/history
- current/longest streak
- only Naam Jap + Meditation contribute

### admin-content
- manage V1-supported content only
- publish/archive
- provenance verification
- audit trail

## API-facing folder contract
```text
module/
├── domain/
├── application/
├── infrastructure/
├── presentation/
│   ├── controllers/
│   ├── routes/
│   ├── requests/
│   ├── responses/
│   └── schemas/
└── index.ts
```

Request/response models and Zod schemas are module-owned.