# Content & Media Specification — V2

## Product principle
Content quality over quantity.

## Mantras
Curated mantra/name library:
- display name
- original text
- transliteration where useful
- verified meaning
- tradition
- focus
- verified pronunciation guidance where applicable
- optional audio asset

## Meditation
Primary: silent 5/10/15/20 minute timer.
Optional: one soft bell/chime and one or two curated ambient tracks.

## Removed content
No Reading catalogue, scripture-reading content, reading progress, Songs/Bhajans catalogue, song collections, song playback, song artwork/audio, or playback history.

## Media
MongoDB stores metadata only. Object storage/CDN may serve approved mantra/meditation assets. API does not proxy media streaming.

## Admin
Admin workflow is limited to V2-supported content; no generic Reading/Song administration.