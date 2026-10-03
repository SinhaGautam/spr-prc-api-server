# Class & Function Creation Specification — Backend V1

## Architecture
src/routes/index.ts
modules/<module>/{entities,controllers,application,infrastructure,requests,responses,schemas,routes.ts,index.ts}
shared/{application,domain}

## Controller
A controller parses and validates HTTP input, obtains the authenticated principal, calls an application service, maps results to response models, selects HTTP status and logs safe context.

It must not contain business calculations, database queries or MongoDB access.

## Application service
An application service orchestrates workflows, calls repository interfaces, applies application policies, handles idempotency and translates dependency failures.

Services remain specialized when the use case is not CRUD.

## Entity
Entities are module-owned business data and invariants. They do not depend on Express or MongoDB.

## Repository
Repositories contain persistence access and mapping only.

Reusable capability interfaces:
- IRepository<TEntity, TId>, ICreateRepository<TEntity>, IMutableRepository<TEntity, TId>, IReadRepository<TEntity, TId>

Module repositories extend the smallest suitable interface and add domain-specific queries.

Do not create generic CRUD controllers or base services merely for symmetry.

## Generic service contracts
shared/application/IService.ts provides reusable service contracts. Use them only where a service naturally matches the contract; non-CRUD services remain specialized.

## Error and logging rules
Do not blanket catch and rethrow. Catch for translation, recovery, meaningful context or documented policy. Preserve causes where supported. Controllers rely on centralized error middleware.

## V1 boundary
No Reading, Songs, Favorites, playback or reading-progress classes, services, controllers or repositories may be created for V1.

## Naming
Classes, types and interfaces use PascalCase. Functions and constants use camelCase. Module controllers use ModuleController. Entities use EntityNameEntity.
