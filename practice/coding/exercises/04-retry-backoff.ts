export type RetryOptions = { attempts: number; baseDelayMs: number; shouldRetry?: (error: unknown) => boolean };
/** Prompt: Retry an async operation with exponential backoff.
 * Example: fail twice then succeed, attempts=3 → result; delays base, base*2.
 */
export async function retryWithBackoff<T>(_operation: () => Promise<T>, _options: RetryOptions): Promise<T> {
  // TODO(PRACTICE): Add retry limits and preserve the last error.
  throw new Error("Not implemented");
}
