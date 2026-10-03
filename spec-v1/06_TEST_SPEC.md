# Test Specification --- Backend V1

## Testing philosophy

Tests are part of the specification, not a final cleanup step.

Every business rule must have executable coverage.

## Test layers

1.  Unit tests
2.  Repository/infrastructure integration tests
3.  API integration tests
4.  Contract tests
5.  Security/authorization tests
6.  End-to-end acceptance tests for critical journeys

## Critical unit tests

### Daily goals

Must test: - enabled Reading only - enabled Naam Jap only - enabled
Meditation only - all three enabled - all disabled - historical goal
snapshot remains unchanged - changing today's/future preferences
according to approved rule

### Daily progress

Must test: - first activity creates progress - repeated completion is
idempotent - Naam Jap accumulates repetitions - meditation accumulates
qualifying minutes - reading completion is boolean/intentional - day
becomes complete exactly when all enabled practices qualify - songs
never affect progress

### Streak

Must test: - first completed day - consecutive completed days - missed
day - current incomplete day - timezone boundary - timezone change -
multiple activities on same day - duplicate activity submission -
historical day correction policy

### Naam Jap

Must test: - zero count rejected where invalid - valid count accepted -
target reached - target exceeded - duplicate clientSessionId - malformed
dates - invalid duration - offline retry

### Meditation

Must test: - supported preset - unsupported duration - completed
session - interrupted session - duplicate clientSessionId - actual
duration aggregation - offline retry

## API integration tests

Every V1 endpoint must cover: - success - validation failure -
authentication failure - authorization failure where applicable - not
found - duplicate/idempotency case - dependency failure where meaningful

## Database integration tests

Use an isolated test MongoDB environment.

Verify: - unique indexes - query filters - pagination - date/time
behaviour - update atomicity - duplicate protection

## Contract tests

Mobile-facing response schemas must be validated so backend changes
cannot silently break the Expo client.

## Acceptance scenarios

### Scenario A --- First day

``` text
Create account
→ choose Hindu
→ choose Ram as optional focus
→ enable Naam Jap + Meditation
→ set targets
→ arrive at Today
→ complete 108 Naam Jap
→ complete Meditation
→ Today shows 2/2
→ day qualifies for streak
```


### Scenario C --- Offline Naam Jap

``` text
Lose network
→ count 108
→ finish session
→ reconnect
→ session syncs once
→ daily progress updates once
```

### Scenario D --- Content governance

``` text
Draft reading
→ not visible publicly

Publish reading
→ visible

Archive reading
→ no longer discoverable

Historical completion
→ remains valid
```

## Coverage requirement

Target: - high coverage of domain/application rules - 100% coverage of
critical completion/streak/idempotency rules - do not chase line
coverage at the expense of behavioural coverage
