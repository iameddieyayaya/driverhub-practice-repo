# Why DriverHub uses both REST and GraphQL

`GET /api/health` is operational, cache-unfriendly, and independent of a member graph. `GET /api/membership` and `GET/PATCH /api/profile` are bounded resources with simple HTTP semantics, familiar status codes, and straightforward browser debugging.

Garage and event screens need related shapes, targeted mutations, and evolving fields, so `/api/graphql` exposes vehicles, events, and favorite state through a single typed schema. GraphQL does not remove HTTP: queries still travel as authenticated HTTP requests, produce status/headers, and require CSRF/origin controls for mutations.

Resolvers and REST handlers are transport adapters only. Both call the same service/repository boundary. This avoids duplicating authorization/business rules and makes replacing a transport less risky.

Tradeoffs to discuss: GraphQL query-cost controls, persisted operations, batching/N+1, CDN caching, REST conditional requests, schema evolution, mobile clients, error semantics, and observability by operation name.
