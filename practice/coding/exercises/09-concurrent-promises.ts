/** Prompt: Map async work with a maximum concurrency while preserving output order.
 * Example: mapWithConcurrency([1,2,3], 2, async n => n*2) → [2,4,6].
 */
export async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  // TODO(PRACTICE): Validate limit and define failure behavior.
  const results: R[] = []
  let nextIndex = 0

  async function runWorker() {

    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex++;
      results[currentIndex] = await worker(items[currentIndex], currentIndex)
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => runWorker()
  )

  await Promise.all(workers)

  return results
}