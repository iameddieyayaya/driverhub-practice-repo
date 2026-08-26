# REST vs GraphQL decision exercise

Complete this after the API behavior is working. Do not answer only in terms of
personal preference; connect each choice to client needs, caching, errors,
observability, and operational complexity.

## Scenario 1: Vehicle detail screen

The screen needs a vehicle, its owner summary, membership tier, and three recent
events. Would you use REST, GraphQL, or a mixture? Why?

TODO(PRACTICE): Write your decision and tradeoffs.

## Scenario 2: Kubernetes-style liveness/readiness probe

The caller needs a small, stable status document and an HTTP status code. Would
you use REST or GraphQL? Why?

TODO(PRACTICE): Write your decision and tradeoffs.

## Scenario 3: Public vehicle export

Clients download the same large representation, CDN caching matters, and fields
rarely vary between consumers. Would you use REST or GraphQL? Why?

TODO(PRACTICE): Write your decision and tradeoffs.

## Comparison table

Fill this in with short, interview-ready statements.

| Concern | REST | GraphQL |
| --- | --- | --- |
| Client-selected fields | TODO(PRACTICE) | TODO(PRACTICE) |
| HTTP/CDN caching | TODO(PRACTICE) | TODO(PRACTICE) |
| Error semantics | TODO(PRACTICE) | TODO(PRACTICE) |
| Versioning/evolution | TODO(PRACTICE) | TODO(PRACTICE) |
| Observability/cost controls | TODO(PRACTICE) | TODO(PRACTICE) |

