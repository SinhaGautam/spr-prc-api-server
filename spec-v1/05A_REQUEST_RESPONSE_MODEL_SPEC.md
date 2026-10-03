# Request & Response Model Specification — Backend V1

Every HTTP endpoint has explicit request and response contracts.

HTTP Request -> Middleware -> Controller -> Request Model/Zod -> Application Service -> Domain Entity/Policy -> Repository Interface -> MongoDB.

Responses follow the reverse direction through a module response model and response schema.

MongoDB documents and entities are never exposed directly as API responses.

## Module ownership
Each API module owns requests, responses and schemas. Controllers live under controllers/. routes.ts only binds middleware and controller handlers.

## Request model
Every endpoint documents path parameters, query parameters, body model, validation, defaults, authentication and authorization.

## Response model
Every endpoint documents success response, status code, response schema, pagination where applicable and error responses.

## Naming
Request/response/schema files use descriptive operation names.
Request/response types use PascalCase.
Zod constants use camelCase ending in Schema.
Controller classes use ModuleController.
Entity classes use EntityNameEntity.

## Errors
All API errors use the centralized envelope with code, message and requestId.

## Validation
Zod validates all untrusted HTTP input at the controller boundary. Controllers pass validated values to application services.

## Anti-patterns
No MongoDB documents as API responses, no any request/response contracts, no arbitrary passthrough fields, no shared feature-specific DTO dumping ground, and no business logic in routes/controllers.
