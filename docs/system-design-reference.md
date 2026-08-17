# Member portal reference design

This is one defensible answer, not the answer.

## Shape

Web/mobile clients use a versioned BFF/API behind CDN/WAF and load balancer. Begin with a modular monolith (identity adapter, member, garage, events, preferences) on stateless containers. PostgreSQL is the source of truth; Redis handles short-lived read/session/rate-limit data; S3/CDN serves images; a durable queue/event bus drives notifications and projections. Managed identity handles MFA/recovery.

```text
Web / iOS / Android
        │ TLS
 CDN + WAF + rate limits
        │
 ALB / versioned BFF ───── cache (Redis)
        │
 modular portal service ── PostgreSQL Multi-AZ + replicas
   │          │
 event outbox └────────── object storage/CDN
   │
 queue → notification workers → email/SMS providers
```

## APIs and consistency

REST works for stable resources and cacheable event listings; GraphQL/BFF can tailor composite mobile/dashboard views. Enforce persisted/query-cost-limited GraphQL operations at scale. Mutations use idempotency keys and optimistic concurrency (`updatedAt`/version). Membership status is strongly consistent at entitlement decisions; event listings and counts tolerate bounded staleness.

Use an outbox transaction when a vehicle/profile mutation must publish an event. Consumers are at-least-once and idempotent. Notification preference is checked again at send time; deduplication keys prevent double sends.

## Data and caching

Normalized relational tables resemble the Prisma schema with unique email, nullable-unique VIN only when present, composite favorite key, ownership/start-date indexes, and cursor pagination. Cache public event pages and short-lived member dashboard projections; key all private cache entries by member and authorization scope. Invalidate or version on writes. Avoid caching sensitive full profiles at the CDN.

## Reliability and scale

Run tasks across three AZs with health-checked autoscaling and rolling/canary deploys. RDS Multi-AZ handles failover; replicas serve safe read paths; backups/PITR meet explicit RPO/RTO. Timeouts, bounded jittered retries, bulkheads, circuit breakers, and degraded responses isolate membership/notification providers. Shed optional enrichment before core account access.

## Security and operations

OIDC/OAuth with PKCE for mobile; short-lived access tokens and rotating refresh tokens; server-side authorization on every object. Encrypt in transit/at rest, tokenize/minimize PII, rotate secrets, least-privilege roles, WAF/rate limits, dependency/image scanning, audit trails, and tested restore/incident processes.

Golden signals are availability, latency, traffic, and saturation, segmented by route/operation and client version. Trace IDs span edge, BFF, database, queue, and provider. SLO-based multi-window alerts guard customer journeys. Deploy expand/migrate/contract schema changes, canary by cohort, automatic rollback on SLO regression, and preserve client compatibility across a published version window.

## Frontend choice → infrastructure impact

Unoptimized member vehicle images inflate bandwidth/LCP, storage transformations, and CDN cost. Client request fan-out increases connections, ALB/ECS load, database concurrency, and mobile battery use. SSR improves first render but consumes compute and database connections per request; cacheable RSC/HTML and a BFF projection control that cost. Long requests occupy ALB/task resources and amplify retry storms.
