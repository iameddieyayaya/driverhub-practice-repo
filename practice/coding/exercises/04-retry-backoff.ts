export type RetryOptions = { attempts: number; baseDelayMs: number; shouldRetry?: (error: unknown) => boolean };
/** Prompt: Retry an async operation with exponential backoff.
 * Example: fail twice then succeed, attempts=3 → result; delays base, base*2.
 */
export async function retryWithBackoff<T>(operation: () => Promise<T>, options: RetryOptions): Promise<T> {
  // TODO(PRACTICE): Add retry limits and preserve the last error.
  if (options.attempts < 1) {
    throw new RangeError("attempts must be at least 1");
  }

  const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  let lastError: unknown

  for (let attemptIndex = 0; attemptIndex < options.attempts; attemptIndex++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      const isLastAttempt = attemptIndex === options.attempts - 1;
      const retryRejected =
        options.shouldRetry?.(error) === false;

      if (isLastAttempt || retryRejected) {
        throw error
      }
      const delayTime = options.baseDelayMs * 2 ** attemptIndex
      await delay(delayTime)
    }
  }

  throw lastError
}
