# Architecture Decision Records — Backend V1

## ADR-001 — Modular monolith
Use one Node.js + TypeScript backend with explicit domain modules.

## ADR-002 — MongoDB
MongoDB is the system of record for V1 application data.

## ADR-003 — No Redis
Do not introduce Redis without an approved V1 requirement.

## ADR-004 — No Kafka
Do not introduce Kafka without an approved V1 requirement.

## ADR-005 — Approved media outside MongoDB
Approved media is stored in object storage/CDN where appropriate.

## ADR-006 — V1 scope is Naam Jap + Meditation
V1 includes only Naam Jap and Meditation. Reading and Songs/Bhajans are removed rather than retained as dormant domains.

## ADR-007 — Silent meditation by default
Meditation is timer-first with a soft completion bell; ambient audio is optional and curated.

## ADR-008 — Optional single devotional focus
A user may select zero or one primary devotional focus.

## ADR-009 — Curated content
V1 uses curated mantra and meditation-related content.

## ADR-010 — No generic favorites
Favorites are not part of V1.

## ADR-011 — Common route registry
src/routes/index.ts is the single API route registry. Module routes own endpoint declarations and controller wiring.

## ADR-012 — Controller boundary
Every API module has a controller. Controllers contain HTTP concerns only and delegate business work to application services.

## ADR-013 — Module-owned entities
All business entities are defined under the owning module's entities directory. shared/domain contains only shared primitives/types.

## ADR-014 — Capability-based generic repositories
V1 provides small generic repository contracts: IRepository, ICreateRepository, IMutableRepository and IReadRepository. Module repositories extend only the capabilities they support.

## ADR-015 — Reusable service contracts without forced CRUD
V1 provides generic service contracts for reuse, but application services remain specialized when their use cases are not CRUD.
