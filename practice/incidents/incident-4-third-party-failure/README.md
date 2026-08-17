# Incident 4 — Downstream event provider timeout

The event enrichment provider’s p99 jumps from 220 ms to 14 s. DriverHub’s `/events` p95 reaches 12 s and task connections pile up.

```ts
const response = await fetch(`${providerUrl}/events/${eventId}`);
return response.json();
```

Evidence: 63% of upstream calls eventually succeed; 37% time out. A naive three-retry change multiplied provider traffic during the incident.

TODO(PRACTICE): Design client timeout, retry budget with jitter, circuit breaking, fallback data, idempotency, and alert thresholds. State which errors are retryable.
