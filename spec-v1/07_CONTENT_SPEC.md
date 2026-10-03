# Content & Media Specification --- V1

## Product principle

Content quality is more important than content quantity.

V1 should launch with a **small, curated, verified catalogue** rather
than a huge ungoverned database.

## Reading

### Recommended V1 catalogue

Start with: - short reflections - selected scripture excerpts - short
devotional stories/teachings

The first release does not need complete versions of every major
scripture.

### Reading length

Prefer: - approximately 2--7 minutes for the primary daily reading -
occasional longer items in the browse library

### Source governance

Every attributed/canonical item must have: - source title -
author/tradition where applicable - reference/location - language -
rights/licensing status - verification status - content version

Do not publish uncertain religious text merely because it is available
online.

## Mantras

V1 should use a curated mantra/name library.

Fields: - display name - original script - transliteration where
useful - meaning/short explanation where verified - tradition - focus -
pronunciation guidance only when verified - optional audio

Do not require a massive deity catalogue for launch.

## Meditation

### V1 session types

**Primary: Silent timer** - 5 min - 10 min - 15 min - 20 min

**Completion sound** - one soft bell/chime

**Optional ambient** - one or two carefully selected ambient tracks - no
song catalogue dependency - no daily goal relation

### Excluded from V1

-   large guided meditation library
-   celebrity voices
-   AI-generated spiritual guidance
-   complicated sound mixer
-   dozens of sound categories

The timer must continue locally even if the network disappears.

## Songs / Bhajans

Songs are discovery/listening content.

### Primary metadata

-   title
-   artist
-   language
-   tradition
-   optional focus
-   tags
-   duration
-   artwork
-   audio asset
-   publication state

### Discovery dimensions

Use a few useful filters: - language - tradition - devotional focus -
theme/tag

Avoid dozens of nested categories.

### Example collections

Curated collections can be: - Morning Bhakti - Rama - Krishna - Shiva -
Hanuman - Jain Prayers - Peaceful - Festival

These are **discovery collections**, not daily-goal categories.

## Media storage

MongoDB stores metadata only.

Object storage stores: - audio - artwork - reading images

CDN delivers public/cacheable assets.

If private/protected media is introduced later, use short-lived signed
URLs.

## Content status

``` text
draft
published
archived
```

Only published content is exposed to the public mobile API.

## Admin requirements

V1 requires a safe way for authorized operators to: - create/edit
content - preview content - attach media - classify
tradition/focus/tags - verify provenance - publish - archive

The admin workflow can be a separate internal interface; it must not be
exposed as a public mobile API.
