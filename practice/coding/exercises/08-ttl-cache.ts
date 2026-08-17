/** Prompt: Build a generic bounded TTL cache with get/set/delete/size.
 * Example: set("a",1,1000); get("a") → 1; after expiry → undefined.
 */
export interface Cache<T> { get(key: string): T | undefined; set(key: string, value: T, ttlMs: number): void; delete(key: string): boolean; readonly size: number }
export function createTtlCache<T>(_maxEntries: number, _now: () => number = Date.now): Cache<T> {
  // TODO(PRACTICE): Implement expiry and a deterministic eviction policy.
  throw new Error("Not implemented");
}
