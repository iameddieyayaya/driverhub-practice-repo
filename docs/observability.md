# Observability in DriverHub

Observability is the ability to infer internal system state from outputs—not a synonym for having logs.

## Signals

- **Logs** are discrete structured events. DriverHub emits JSON with timestamp, severity, requestId, route, userId when known, duration, statusCode, and error. Avoid passwords, session tokens, full VINs, or unnecessary PII.
- **Metrics** aggregate numeric behavior cheaply: request count, latency, errors, and database query duration. `/api/health` exposes an intentionally simple in-process snapshot; production would export OpenTelemetry/CloudWatch/Prometheus metrics.
- **Traces** connect spans across edge → Next.js → service → Prisma/PostgreSQL → downstream provider. Propagate trace/request IDs; do not create unrelated IDs at every hop.

Latency percentiles answer different questions: p50 is typical, p95 represents slower common requests, p99 exposes tail pain. An average can hide both. Error rate is failed requests divided by total requests; throughput is requests/events per time unit.

## Service objectives

Example SLI: percentage of authenticated dashboard requests returning a non-5xx response in under 1 second. Example SLO: 99.9% availability and 95% under 1 second over a rolling 28-day window. The exact target is a product decision; an error budget permits 0.1% failure and guides release risk.

Candidate alerts:

- fast burn: 5xx error budget consumption >14× for 5 minutes;
- slow burn: >2× for 1 hour;
- dashboard p95 >1 second for 15 minutes with minimum traffic;
- PostgreSQL connections >80%, lock wait, storage/CPU saturation;
- ECS restarts, memory slope, task count below desired;
- downstream timeout/circuit-open rate.

Alerts should be actionable, routed, deduplicated, and linked to a runbook/dashboard. Page on customer impact or imminent exhaustion, not every exception.

## Request instrumentation

`proxy.ts` places `x-request-id` on requests. `withRequestLogging` records route duration and status for route handlers. `metrics.ts` demonstrates request/query metric shapes. Gaps are deliberate discussion points: process-local metrics reset, page Server Components are not wrapped, GraphQL operation names are not yet dimensions, and there is no distributed exporter.

TODO(PRACTICE): Add OpenTelemetry spans around one REST route, one service method, and one Prisma query without logging sensitive data or creating high-cardinality metric labels.
