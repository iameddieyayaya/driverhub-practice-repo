# Delivery pipeline

The GitHub Actions workflow installs from the lockfile, generates Prisma, migrates/seeds an ephemeral PostgreSQL service, then runs lint, strict typecheck, unit/RTL, integration, production build, and Playwright. The mock deploy job demonstrates environment promotion only after quality succeeds.

A production pipeline would build once, scan/sign an immutable container, publish its digest to ECR, deploy that same digest through staging/canary/production, run smoke/SLO checks, and record actor/SHA/migrations. GitHub OIDC assumes a narrowly scoped AWS deploy role; no long-lived AWS keys.

## Safe database and application delivery

Use expand → migrate/backfill → contract. New and old application versions must coexist during rollout. Run backward-compatible migrations before traffic shift, put destructive cleanup in a later deployment, and make one-off jobs observable/idempotent.

## Strategies

- **Rollback:** point the service to the last known-good image digest. Fast for app regressions; unsafe when a non-compatible migration already changed data.
- **Canary:** send a small representative cohort/traffic percentage to the new revision, compare errors/latency/business signals, then increase or abort.
- **Blue/green:** keep complete old/new environments, test green, switch traffic, retain blue briefly. Fast reversal but higher cost and database compatibility complexity.
- **Progressive delivery:** automate staged exposure by percentage, region, tenant, or feature flag with SLO gates. Decouple code deployment from feature release.

Artifacts and test reports should be retained. Cache npm downloads by lockfile, not mutable build output. Protect production with reviewed environments and concurrency controls. Do not hide flaky tests with retries; Playwright retries in CI should retain traces and trigger ownership work.

TODO(PRACTICE): Replace the mock deploy with an OIDC-authenticated ECR/ECS canary that never applies Terraform and rolls back automatically on a defined alarm.
