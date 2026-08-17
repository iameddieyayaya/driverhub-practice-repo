export type Page<T> = { items: T[]; page: number; pageSize: number; totalItems: number; totalPages: number };
/** Prompt: Return a one-indexed page without mutating the input.
 * Example: paginate([1,2,3,4,5], 2, 2) → {items:[3,4],page:2,pageSize:2,totalItems:5,totalPages:3}
 */
export function paginate<T>(_items: readonly T[], _page: number, _pageSize: number): Page<T> {
  // TODO(PRACTICE): Validate invalid page/pageSize values and define out-of-range behavior.
  throw new Error("Not implemented");
}
