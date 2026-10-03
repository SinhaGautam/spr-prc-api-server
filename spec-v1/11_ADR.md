# Architecture Decision Records --- V1

## ADR-001 --- Modular monolith

**Decision:** Use one Node.js + TypeScript backend with explicit domain
modules.

**Reason:** V1 has a small number of tightly related domains and does
not require independent service scaling.

**Rejected:** Microservices.

**Revisit when:** independent scaling/deployment boundaries become a
measured requirement.

------------------------------------------------------------------------

## ADR-002 --- MongoDB as primary database

**Decision:** MongoDB is the system of record.

**Reason:** Content metadata, user preferences, sessions, and progress
are document-friendly; V1 benefits from schema flexibility while content
models mature.

**Revisit when:** workload characteristics prove a different persistence
model is required.

------------------------------------------------------------------------

## ADR-003 --- No Redis in V1

**Decision:** Do not introduce Redis.

**Reason:** No V1 requirement needs distributed caching or ephemeral
coordination.

**Revisit when:** measured cache/rate-limit/session/coordination needs
justify it.

------------------------------------------------------------------------

## ADR-004 --- No Kafka in V1

**Decision:** Do not introduce Kafka.

**Reason:** V1 has no high-volume event-streaming requirement or
independent consumer ecosystem.

**Revisit when:** event volume and multiple independent consumers
justify an event-streaming platform.

------------------------------------------------------------------------

## ADR-005 --- Audio outside MongoDB

**Decision:** Store audio/images in object storage and deliver through
CDN.

**Reason:** Media is large and delivery should not consume API server
bandwidth.

------------------------------------------------------------------------

## ADR-006 --- Songs outside daily practice

**Decision:** Songs are a discovery/listening domain, not a habit
domain.

**Reason:** The product promise is spiritual continuity, not maximising
task completion. Mixing songs into streaks would distort the intended
practice model.

------------------------------------------------------------------------

## ADR-007 --- Silent meditation by default

**Decision:** V1 meditation is a timer-first experience with a soft
completion bell. Ambient audio is optional and curated.

**Reason:** It is technically simple, avoids a large guided-content
operation, and preserves stillness.

**Rejected for V1:** large guided meditation library.

------------------------------------------------------------------------

## ADR-008 --- Optional single devotional focus

**Decision:** Users may select zero or one primary focus in V1.

**Reason:** Focus personalisation is useful, but forcing or supporting
many simultaneous focuses would add unnecessary taxonomy and UX
complexity.

**Revisit when:** user research demonstrates demand for multiple
focuses.

------------------------------------------------------------------------

## ADR-009 --- Curated content before recommendation engine

**Decision:** V1 uses editorial/curated selection.

**Reason:** Religious content quality, provenance, and trust matter more
than algorithmic recommendation at launch.

**Rejected:** ML recommendation system.

------------------------------------------------------------------------

## ADR-010 --- Explicit reading completion

**Decision:** Reading is completed by explicit user action.

**Reason:** It is transparent, deterministic, and avoids silently
declaring a spiritual practice "done" based on scrolling behaviour.
