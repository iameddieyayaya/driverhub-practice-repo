# Incident 3 — Memory climbs until restart

Each ECS task grows from 260 MB to 1.8 GB over six hours, then restarts. Traffic is flat. Heap snapshots show retained event-detail responses.

```ts
const eventCache = new Map<string, Event>();

export async function getEvent(id: string) {
  if (!eventCache.has(id)) eventCache.set(id, await loadEvent(id));
  return eventCache.get(id);
}
```

TODO(PRACTICE): Explain why this cache is unbounded, how you would confirm retention, and choose an eviction/TTL/ownership strategy. Consider multi-task consistency.
