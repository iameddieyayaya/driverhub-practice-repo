/** Prompt: Build a generic bounded TTL cache with get/set/delete/size.
 * Example: set("a",1,1000); get("a") → 1; after expiry → undefined.
 */
export interface Cache<T> { get(key: string): T | undefined; set(key: string, value: T, ttlMs: number): void; delete(key: string): boolean; readonly size: number }
export function createTtlCache<T>(maxEntries: number, now: () => number = Date.now): Cache<T> {
  // TODO(PRACTICE): Implement expiry and a deterministic eviction policy.
  if (!Number.isInteger(maxEntries) || maxEntries < 1) {
    throw new RangeError("maxEntries must be a positive integer");
  }

  const ttlCache = new Map<string, { value: T, expiresAt: number }>();

  const pruneExpired = (): void => {
    const currentTime = now()

    for (const [key, entry] of ttlCache) {
      if (entry.expiresAt <= currentTime) {
        ttlCache.delete(key)
      }
    }

  }

  const set = (key: string, value: T, ttlMs: number): void => {
    pruneExpired();

    ttlCache.delete(key)

    ttlCache.set(key, {
      value,
      expiresAt: now() + ttlMs
    })

    while (ttlCache.size > maxEntries) {
      const oldestKey = ttlCache.keys().next().value

      if (oldestKey === undefined) {
        break;
      }

      ttlCache.delete(oldestKey)
    }

  }

  const get = (key: string): T | undefined => {
    const entry = ttlCache.get(key)

    if (!entry) {
      return undefined
    }

    if (entry.expiresAt <= now()) {
      ttlCache.delete(key)
      return undefined
    }

    ttlCache.delete(key)
    ttlCache.set(key, entry)

    return entry.value
  }

  const deleteEntry = (key: string): boolean => {
    return ttlCache.delete(key)
  }

  return {
    get,
    set,
    delete: deleteEntry,
    get size() {
      pruneExpired()
      return ttlCache.size
    }
  }
}
