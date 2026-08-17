# What happens when a member visits `/dashboard`

1. **DNS:** the resolver finds the portal’s edge/CloudFront address. Failures: stale/incorrect records, resolver timeout, bad DNSSEC, propagation.
2. **TCP (or QUIC):** client and edge establish a connection. Failures: packet loss, blocked port, exhausted sockets, regional routing.
3. **TLS:** certificates and cipher parameters establish encrypted transport. Failures: expired/mismatched cert, incomplete chain, clock skew, old protocol.
4. **HTTP request:** browser sends method, path, cookies, accept/encoding, and trace context. Failures: oversized headers, malformed URL, proxy timeout.
5. **Edge/load balancer:** CloudFront/WAF/ALB may cache, reject, route, or attach forwarding headers. Failures: unhealthy targets, security rule, routing mismatch, cache poisoning/miss storm.
6. **Next.js proxy/router:** `proxy.ts` creates a request ID, validates the signed session for protected paths, then App Router selects layouts/page. Failures: redirect loop, edge/runtime mismatch, route collision.
7. **Session lookup:** the HTTP-only cookie JWT signature and expiry are verified. Failures: missing/expired/tampered token, rotated secret, insecure cookie configuration, clock skew.
8. **Application data request:** the Dashboard Server Component starts member and event service work in parallel. Later client actions call REST/GraphQL with the cookie automatically. Failures: unauthorized call, schema/validation error, CORS/CSRF policy, upstream timeout.
9. **Database query:** services call repositories; Prisma parameterizes SQL; PostgreSQL uses constraints/indexes and returns rows. Failures: pool exhaustion, lock, slow plan, missing index, replica lag, unavailable primary, migration mismatch.
10. **Server response:** React renders the server component payload/HTML; Next.js adds cache and transport headers; structured logs capture route, request ID, duration, user, and status. Failures: serialization error, oversized payload, streaming interruption, hidden 500.
11. **Browser rendering:** HTML parses, CSS lays out/paints, React hydrates client islands, accessibility tree updates. Failures: missing asset, hydration mismatch, long main-thread task, layout shift, JS exception.
12. **Subsequent navigation/API calls:** Next `<Link>` prefetch/RSC navigation and client `fetch` requests reuse connections and cookies. GraphQL mutations update local UI state. Failures: stale client state, duplicate request, race, failed optimistic update, expired session.

## Debugging sequence

Start with what the user saw and a timestamp. Check Network (URL/status/timing/headers/request ID), Console, server log by request ID, service metrics, database telemetry, and recent deployments. Move one boundary at a time and distinguish connection time, server wait, payload transfer, and browser work.
