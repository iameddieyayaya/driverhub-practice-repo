/** Prompt: Return a debounced function with a cancel method. Latest arguments win.
 * Example: call("m"), call("mi"), call("mia") within 200ms → callback runs once with "mia".
 */
export type Debounced<TArgs extends unknown[]> = ((...args: TArgs) => void) & { cancel: () => void };
export function debounce<TArgs extends unknown[]>(callback: (...args: TArgs) => void, delayMs: number): Debounced<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((...args: TArgs) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      callback(...args);
    }, delayMs);
  }) as Debounced<TArgs>;

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}

