# Why each test belongs where it does

- **Unit:** validation and formatting are deterministic and fast; the service authorization test isolates ownership policy from infrastructure.
- **React Testing Library:** sign-in/profile tests exercise accessible controls, loading feedback, API failures, and user-visible outcomes without coupling to CSS or component internals.
- **Integration:** the vehicle service test proves Prisma constraints, transactions, authorization, and PostgreSQL behavior together. It skips unless `TEST_DATABASE_URL` is present.
- **E2E:** the Playwright journey proves only high-value cross-layer workflows. It intentionally avoids every visual variant and minor validation branch.

Prefer the lowest layer that can catch the failure. Keep a small E2E suite because browser journeys are slower and more expensive to diagnose.
