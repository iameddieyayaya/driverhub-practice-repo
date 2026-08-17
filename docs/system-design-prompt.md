# System design prompt

> Design a Member Portal used by hundreds of thousands of automotive enthusiasts.

Support authentication, profiles, memberships, member vehicles, notification preferences, automotive events, saved items, notifications, web and mobile clients, observability, and high availability.

## Interview format (45–60 minutes)

1. Clarify user journeys, peak traffic, geography, consistency, privacy, event freshness, and availability targets.
2. Estimate read/write/storage/notification volume and identify the dominant path.
3. Draw clients, edge, APIs/services, data stores, async components, and trust boundaries.
4. Deep-dive one workflow: dashboard read, vehicle mutation, or event notification.
5. Discuss API architecture, relational design/indexes, caching/invalidation, horizontal scaling, failure modes, security, monitoring, deployment, and mobile/web consistency.
6. State tradeoffs and a staged evolution from simple to scaled.

Questions the interviewer may add:

- What happens if the membership provider is unavailable?
- How do you avoid duplicate notifications?
- How do mobile clients survive API evolution?
- Which data can be stale, for how long, and who decides?
- How do you trace a slow dashboard across five dependencies?
- How do you deploy a breaking database change without downtime?

Do not open `system-design-reference.md` until you complete and critique your own design.

TODO(PRACTICE): Produce a requirements table, capacity estimates, API examples, schema, architecture diagram, failure table, and three explicit tradeoffs.
