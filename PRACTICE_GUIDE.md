# Seven-day DriverHub progression

Work in 60–90 minute blocks. Begin each task by stating a hypothesis and finish by explaining the request path aloud. Keep a scratch incident log with evidence, decision, tradeoff, and follow-up.

## Day 1 — React, Next.js, TypeScript

- Trace `app/(portal)/vehicles/page.tsx` from Server Component to `VehicleManager` Client Component.
- Build or edit one garage UI feature; preserve keyboard/focus behavior.
- Profile `RenderLab` and explain unnecessary rendering.
- List which data crosses the server/client serialization boundary.
- Complete coding exercises 01, 06, and 07.

## Day 2 — HTTP, REST, GraphQL, browser debugging

- Read `docs/http-lifecycle.md`; narrate `/dashboard` without notes.
- Inspect document, RSC, REST, and GraphQL headers in Network.
- Complete slow API, CORS, 401, 500, and N+1 labs.
- Explain why profile is REST while garage operations are GraphQL.
- Use “Copy as cURL” and compare browser/cURL behavior.

## Day 3 — Testing

- Read `tests/TESTING_STRATEGY.md` and challenge one test’s layer.
- Add one validation/service unit test and one form failure-state RTL test.
- Run the database integration test against a disposable database.
- Extend the Playwright flow with one valuable assertion.
- Explain mocks, determinism, test isolation, and flake diagnosis.

## Day 4 — AWS, Docker, Terraform, CI/CD

- Run PostgreSQL and the app via Compose; inspect health checks/logs.
- Redraw `infra/aws-architecture.md` from memory.
- Run `terraform init`, `fmt`, and `validate`; inspect the plan only.
- Add one safe CI check and explain cache/artifact boundaries.
- Compare rollback, canary, blue/green, and progressive delivery.

## Day 5 — Observability, security, production debugging

- Follow one request ID through the response and structured log.
- Propose dashboard panels and alerts from `docs/observability.md`.
- Investigate two incident folders without reading a solution.
- Review every insecure example and identify preventive/detective controls.
- Explain encryption in transit/at rest and least-privilege IAM.

## Day 6 — System design

- Time-box `docs/system-design-prompt.md` to 45 minutes.
- Clarify requirements, estimate scale, draw data/request paths, then find bottlenecks.
- Discuss consistency, caching, failure isolation, mobile/web parity, observability, and deployment.
- Only afterward compare with `docs/system-design-reference.md`; write three deltas.

## Day 7 — Interview simulation

- Solve two TypeScript exercises aloud in 35 minutes.
- Answer three prompts from `docs/behavioral.md` using real Jampak examples.
- Explain one Jampak system end-to-end, including a failure path.
- Diagnose one incident from evidence in 25 minutes.
- Run a 45-minute member-portal design mock and finish with tradeoffs.

## Recommended first move

Run the app, sign in, and open `/vehicles` with Network and React DevTools visible. Read `app/(portal)/vehicles/page.tsx`, `src/components/vehicles/vehicle-manager.tsx`, `app/api/graphql/route.ts`, `src/server/graphql/schema.ts`, `src/server/services/vehicle-service.ts`, and `src/server/repositories/vehicle-repository.ts` in that order. Add a vehicle and narrate every boundary.
