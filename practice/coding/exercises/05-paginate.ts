export type Page<T> = { items: T[]; page: number; pageSize: number; totalItems: number; totalPages: number };
/** Prompt: Return a one-indexed page without mutating the input.
 * Example: paginate([1,2,3,4,5], 2, 2) → {items:[3,4],page:2,pageSize:2,totalItems:5,totalPages:3}
 */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  // TODO(PRACTICE): Validate invalid page/pageSize values and define out-of-range behavior.
  if (!Number.isInteger(page) || page <= 0) {
    throw new RangeError("page must be a positive integer");
  }

  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError("pageSize must be a positive integer");
  }


  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize
  const end = start + pageSize

  const pageItems = items.slice(start, end)

  return {
    items: pageItems,
    page,
    pageSize,
    totalItems,
    totalPages
  } as Page<T>
}
