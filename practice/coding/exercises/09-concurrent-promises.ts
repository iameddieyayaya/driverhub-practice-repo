/** Prompt: Map async work with a maximum concurrency while preserving output order.
 * Example: mapWithConcurrency([1,2,3], 2, async n => n*2) → [2,4,6].
 */
export async function mapWithConcurrency<T, R>(_items: readonly T[], _limit: number, _worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  // TODO(PRACTICE): Validate limit and define failure behavior.
  throw new Error("Not implemented");
}
