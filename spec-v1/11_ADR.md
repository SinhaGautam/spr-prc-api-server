# Architecture Decision Records — Backend V1

## ADR-001 — Modular monolith

**Decision:** Use one Node.js + TypeScript backend with explicit domain modules.

**Reason:** V1 has a small number of tightly related domains and does not require independent service scaling.

**Rejected:** Microservices.

## ADR-002 — MongoDB as primary database

**Decision:** MongoDB is the system of record.

**Reason:** User preferences, mantra metadata, sessions, and progress are document-friendly.

## ADR-003 — No Redis in V1

**Decision:** Do not introduce Redis.

**Reason:** No V1 requirement needs distributed caching or ephemeral coordination.

## ADR-004 — No Kafka in V1

**Decision:** Do not introduce Kafka.

**Reason:** V1 has no high-volume event-streaming requirement.

## ADR-005 — Approved media outside MongoDB

**Decision:** Store approved mantra/meditation audio and images in object storage and deliver through CDN where required.

**Reason:** Media is large and delivery should not consume API server bandwidth.

## ADR-006 — V1 scope is Naam Jap + Meditation

**Decision:** V1 includes only Naam Jap and Meditation as user practices.

**Reason:** The initial release intentionally focuses on the smallest spiritual practice core.

Reading and Songs/Bhajans are removed from V1 rather than retained as dormant domains.

**Future:** Reintroducing either capability requires an approved specification change.

## ADR-007 — Silent meditation by default

**Decision:** V1 meditation is a timer-first experience with a soft completion bell. Ambient audio is optional and curated.

**Reason:** It keeps the experience simple and preserves stillness.

## ADR-008 — Optional single devotional focus

**Decision:** Users may select zero or one primary focus in V1.

**Reason:** Focus personalisation is useful without adding unnecessary taxonomy complexity.

## ADR-009 — Curated mantra/content before recommendation engine

**Decision:** V1 uses editorial/curated selection for mantra and meditation-related content.

**Reason:** Religious content quality, provenance, and trust matter more than algorithmic recommendation at launch.

**Rejected:** ML recommendation system.

## ADR-010 — No generic favorites in V1

**Decision:** V1 does not expose a generic favorites feature.

**Reason:** Favorites were primarily coupled to the removed Reading/Song experience and are not required for the Naam Jap + Meditation release.
