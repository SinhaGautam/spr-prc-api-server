# Domain Rules — Backend V2

## Rule 1 — Exactly two tracked practices
```text
naam_jap
meditation
```
Reading and Songs are not V2 practice types.

## Rule 2 — Goal snapshots
Effective daily goals are stored by user/localDate/timezone. Historical snapshots are immutable.

## Rule 3 — Naam Jap
A valid session contributes `completedRepetitions` once. Daily completion is:
```text
dailyRepetitions >= targetRepetitions
```

## Rule 4 — Meditation
Qualifying completed minutes contribute to the daily aggregate. Daily completion is:
```text
dailyMinutes >= targetMinutes
```
The completion threshold must be deterministic and tested.

## Rule 5 — Day completion
```text
dayCompleted = every enabled V2 practice is complete
```
None enabled means no active daily goal, not failure.

## Rule 6 — Streak
A day qualifies when `dayCompleted=true`. User timezone determines local date. Current-day incompleteness does not immediately erase the prior streak. First-day and timezone migration behavior must be deterministic and tested.

## Rule 7 — Removed feature isolation
No V2 business rule may read Reading completion, Song playback, or count either feature toward daily goals, progress, or streaks. No V2 completion event exists for them.

## Rule 8 — Offline idempotency
Same client idempotency key means the same logical activity; duplicate replay must not double-count.

## Rule 9 — Historical snapshots
Retain immutable information needed to understand historical activity such as mantra text snapshot, target values, date, and timezone.

## Rule 10 — Stillness
No badges, points, rankings, aggressive reminder mechanics, or engagement loops without a new approved requirement.