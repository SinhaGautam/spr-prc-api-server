# Domain Rules --- V1

## Rule 1 --- Daily practice has exactly three tracked practice types

``` text
reading
naam_jap
meditation
```

Songs are never a tracked daily practice.

## Rule 2 --- Goal snapshots are date-specific

When a day begins, its effective goals are represented by a
`daily_goals` document.

Changing preferences later affects future days unless the product
explicitly provides a same-day adjustment rule.

Historical days must remain stable.

## Rule 3 --- Reading completion

A reading counts as complete when the user explicitly completes it.

Do not infer completion merely because: - the detail page was opened -
the user scrolled to the bottom - a timer elapsed

This keeps completion intentional and respectful.

## Rule 4 --- Naam Jap completion

Naam Jap progress is based on valid completed repetitions.

A session contributes:

``` text
completedRepetitions
```

to the current day's aggregate.

A daily Naam Jap goal is complete when:

``` text
dailyRepetitions >= targetRepetitions
```

Additional repetitions may be recorded but do not create multiple daily
completions.

## Rule 5 --- Meditation completion

A meditation goal is complete when:

``` text
actual completed minutes >= target minutes
```

The exact completion threshold must be deterministic.

Recommended V1: - completed session counts full planned duration -
interrupted session counts actual elapsed duration - session is marked
`completed=true` only after reaching the planned duration or explicit
completion threshold

## Rule 6 --- Day completion

``` text
dayCompleted =
  every enabled practice is complete
```

If only Reading and Meditation are enabled, Naam Jap is irrelevant to
that day's completion.

If all three are disabled, the user has no active daily-practice goal.
The UI should avoid presenting this as failure.

## Rule 7 --- Streak

A day qualifies for streak continuation when `dayCompleted=true`.

Recommended V1: - consecutive local calendar days - user timezone
determines date - current day may be incomplete without immediately
destroying the prior streak - streak breaks only when a required day
passes without completion

The exact handling of first-day and timezone migration must be covered
by tests.

## Rule 8 --- Songs are independent

The following are forbidden: - `songCompleted` in daily progress - song
target in daily goals - song completion contributing to streak -
reminder notification stating that a song goal is incomplete

Songs may still be: - favorited - played - resumed - included in curated
collections

## Rule 9 --- Taxonomy

Content classification is multi-dimensional:

``` text
Tradition
Focus
Language
Practice/content type
Theme/tag
```

Do not create:

``` text
Hindu/Ram/Morning/Peace/Reading
Hindu/Ram/Morning/Courage/Reading
...
```

as fixed categories.

## Rule 10 --- Primary focus is optional

A user may: - select one focus - select none

Do not force a focus.

V1 should not require multiple devotional focuses. Multiple-focus
preferences can be added later if actual users request them.

## Rule 11 --- Content selection

Today content should be curated/deterministic before recommendation
algorithms exist.

Selection priority may be:

1.  language match
2.  tradition match
3.  primary focus match
4.  curated priority
5.  recent exposure avoidance

Do not build ML recommendations in V1.

## Rule 12 --- Offline sessions

Every offline-created session must contain a client-generated
idempotency key.

The server must safely accept a retry of the same key without
duplicating the activity.

## Rule 13 --- Historical snapshots

Historical activity must preserve enough information to remain
understandable if the referenced content later changes.

Examples: - mantra text snapshot - relevant target values - effective
timezone/date

## Rule 14 --- Stillness principle

Backend design must not force the UI into: - badges - points -
rankings - streak-loss notifications - excessive reminders - engagement
loops

The backend supports continuity, not compulsion.
