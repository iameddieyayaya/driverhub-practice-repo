export class TimeoutError extends Error {}
/** Prompt: Reject with TimeoutError if an operation does not settle in time and clean up the timer.
 * Example: withTimeout(delay(500), 50) → rejects TimeoutError.
 */
export async function withTimeout<T>(_operation: Promise<T>, _timeoutMs: number): Promise<T> {
  // TODO(PRACTICE): Implement and discuss why this does not cancel underlying work.
  throw new Error("Not implemented");
}
