/** Prompt: Return a debounced function with a cancel method. Latest arguments win.
 * Example: call("m"), call("mi"), call("mia") within 200ms → callback runs once with "mia".
 */
export type Debounced<TArgs extends unknown[]> = ((...args: TArgs) => void) & { cancel: () => void };
export function debounce<TArgs extends unknown[]>(_callback: (...args: TArgs) => void, _delayMs: number): Debounced<TArgs> {
  // TODO(PRACTICE): Implement without using `any`; consider timer portability.
  throw new Error("Not implemented");
}
