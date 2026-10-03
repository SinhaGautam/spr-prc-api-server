# Module Specification --- Backend V1

## Architecture style

Modular monolith. One deployable backend, explicit domain boundaries.

## Module matrix

  --------------------------------------------------------------------------
  Module                  Owns                       Does not own
  ----------------------- -------------------------- -----------------------
  auth                    authentication, identity   daily practice

  users                   profile                    religious taxonomy

  preferences             tradition/focus/practice   content publication
                          preferences                

  content                 shared taxonomy +          user progress
                          publication metadata       

  reading                 reading lifecycle/progress daily aggregation
                          rules                      

  naam-jap                mantra and japa sessions   daily aggregation

  meditation              meditation                 song playback
                          presets/sessions           

  daily-practice          daily goal snapshot +      content authoring
                          aggregation                

  progress                historical                 raw activity rules
                          summaries/streak read      
                          models                     

  songs                   song catalogue + playback  daily goals
                          metadata                   

  favorites               user bookmarks             content ownership

  notifications           reminder                   practice completion
                          preferences/delivery       

  admin-content           content                    user-owned activity
                          authoring/publishing       

  health                  liveness/readiness         business logic
  --------------------------------------------------------------------------

## Dependency direction

``` text
Controllers
   ↓
Application services
   ↓
Domain services / policies
   ↓
Repositories
   ↓
MongoDB

Shared infrastructure may be used by modules.
Domain modules must not depend on controllers.
```

## Module requirements

### auth

-   authenticate supported login method
-   establish authenticated principal
-   revoke/expire sessions according to auth strategy
-   never expose password hashes

### users

-   retrieve/update user profile
-   support account lifecycle
-   timezone is required for daily boundaries

### preferences

-   tradition
-   optional primary devotional focus
-   enabled daily practices
-   daily target values
-   reminder preference
-   language

### content

-   content status: draft, published, archived
-   tradition references
-   focus references
-   tags
-   language
-   provenance

### reading

-   list published readings
-   retrieve a reading
-   record progress
-   complete reading
-   return recent/continue reading

### naam-jap

-   list available mantra presets
-   record completed sessions
-   validate count and duration
-   support client idempotency

### meditation

-   expose V1 timer presets
-   create completed/partial session records
-   validate duration
-   expose available ambient assets if enabled

### daily-practice

-   derive today's goal snapshot
-   update practice progress from activity completion
-   calculate daily completion
-   preserve historical snapshots

### progress

-   return today
-   return calendar/history
-   calculate current/longest streak using defined rules
-   never infer completion from songs

### songs

-   list/filter published songs
-   retrieve song metadata
-   return streaming asset metadata
-   optionally record meaningful playback events
-   no daily goal integration

### favorites

-   add/remove/list favorites
-   enforce ownership

### notifications

-   register device/token if push is used
-   store reminder preference
-   respect local timezone
-   no notification is sent for songs as a goal reminder

## Cross-module rule

A daily-progress update may consume an activity completion result, but
the activity module must not directly write arbitrary daily-progress
fields.

Preferred pattern:

``` text
Practice Service
   ↓
ActivityCompleted result
   ↓
DailyPractice Application Service
   ↓
DailyProgress repository
```


## Module folder contract

Every API-facing module should follow this shape:

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

Request/response models and their Zod schemas are module-owned.

Naming:
- file names: kebab-case
- classes/types/interfaces: PascalCase
- functions/constants: camelCase
- Zod schema constants: camelCase + `Schema`

See `05A_REQUEST_RESPONSE_MODEL_SPEC.md`.
