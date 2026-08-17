# Incident 1 — Vehicle API error spike

At 14:05 UTC, deployment `web-2026.08.14.3` completed. Within four minutes, GraphQL vehicle mutation errors rose from 0.4% to 10.7%. Reads remain healthy. No answer is included.

## Timeline

- 13:57 — CI green; image promoted to production
- 14:02 — canary receives 10% traffic
- 14:05 — rollout reaches 100%
- 14:07 — `VehicleMutationErrorRateHigh` alert fires
- 14:09 — support reports “VIN already exists” on vehicles without VINs

## Evidence

See `sample.log`. Compare the validation-to-repository mapping in `src/server/services/vehicle-service.ts` with nullable uniqueness behavior. Determine scope, a safe mitigation, and what regression test belongs at which layer.

TODO(PRACTICE): Write an incident hypothesis, disconfirming test, mitigation, and permanent fix before asking for the solution.
