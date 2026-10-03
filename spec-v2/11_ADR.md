# Architecture Decision Records — V2

## ADR-001 — Preserve modular monolith
Retain the V1 modular-monolith architecture.

## ADR-002 — Two tracked practices
V2 daily goals/progress/streaks contain only Naam Jap and Meditation.

## ADR-003 — Remove Reading and Songs domains
Delete their modules, routes, repositories, persistence contracts, tests, seeds, and active references.

## ADR-004 — Remove generic favorites
Do not carry forward generic favorites because V2 has no approved favorites requirement.

## ADR-005 — Retain approved media infrastructure
Keep object storage/CDN only for approved mantra/meditation assets.

## ADR-006 — No Redis/Kafka
No new infrastructure is introduced solely due to V2 scope reduction.

## ADR-007 — Version API at /api/v2
V2 uses a versioned API because its tracked-practice/data contract differs from V1.

## ADR-008 — Preserve spec-v1
Do not edit `spec-v1/`; it remains the historical baseline.